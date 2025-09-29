# 🔧 Laravel Technical Requirements - BSU ScholarStreet

## 📊 **Stored Procedures in Laravel**

### ✅ **YES, Laravel Supports Stored Procedures!**

```php
// In Laravel Controller or Model
use Illuminate\Support\Facades\DB;

// Call stored procedure
$results = DB::select('CALL get_student_scholarships(?)', [$student_id]);

// Stored procedure with multiple parameters
$applications = DB::select('CALL review_applications(?, ?, ?)', 
    [$scholarship_id, $status, $reviewer_id]);

// For insert/update stored procedures
DB::statement('CALL update_application_status(?, ?)', [$application_id, $status]);
```

### **Example Stored Procedures for Your Project:**

```sql
-- Get scholarships based on student GWA
DELIMITER $$
CREATE PROCEDURE get_eligible_scholarships(IN student_gwa DECIMAL(3,2))
BEGIN
    SELECT * FROM scholarships 
    WHERE required_gwa >= student_gwa 
    AND deadline >= CURDATE()
    AND status = 'active';
END$$

-- Process application review
DELIMITER $$
CREATE PROCEDURE process_application(
    IN app_id INT, 
    IN review_status VARCHAR(20),
    IN reviewer_notes TEXT
)
BEGIN
    UPDATE applications 
    SET status = review_status, 
        reviewer_notes = reviewer_notes,
        reviewed_at = NOW()
    WHERE id = app_id;
    
    -- Log the review action
    INSERT INTO application_logs (application_id, action, reviewer_id, created_at)
    VALUES (app_id, review_status, @reviewer_id, NOW());
END$$
```

---

## 📁 **File Upload in Laravel**

### ✅ **Laravel Has BUILT-IN File Upload! No Google Drive API Needed!**

```php
// In your Controller
public function uploadDocuments(Request $request)
{
    // Validate file
    $request->validate([
        'transcript' => 'required|file|mimes:pdf|max:5120', // 5MB max
        'recommendation' => 'required|file|mimes:pdf|max:5120'
    ]);

    // Store files
    $transcriptPath = $request->file('transcript')->store('transcripts', 'public');
    $recommendationPath = $request->file('recommendation')->store('recommendations', 'public');

    // Save to database
    Application::create([
        'user_id' => auth()->id(),
        'scholarship_id' => $request->scholarship_id,
        'transcript_path' => $transcriptPath,
        'recommendation_path' => $recommendationPath,
        'status' => 'submitted'
    ]);

    return redirect()->back()->with('success', 'Application submitted!');
}
```

### **File Storage Configuration:**
```php
// config/filesystems.php - Already configured in Laravel
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

### **File Upload Form (Blade Template):**
```blade
<form action="{{ route('applications.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    
    <div class="mb-3">
        <label class="form-label">Upload Transcript (PDF)</label>
        <input type="file" name="transcript" class="form-control" accept=".pdf" required>
    </div>
    
    <div class="mb-3">
        <label class="form-label">Upload Recommendation Letter (PDF)</label>
        <input type="file" name="recommendation" class="form-control" accept=".pdf" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Submit Application</button>
</form>
```

---

## 📱 **SMS OTP with Semaphore API in Laravel**

### ✅ **Laravel Can Handle SMS OTP Easily!**

### **Step 1: Install HTTP Client (Already in Laravel)**
```bash
# Laravel comes with HTTP client built-in
# No additional packages needed for basic HTTP requests
```

### **Step 2: Create Semaphore Service Class**
```php
// app/Services/SemaphoreService.php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SemaphoreService
{
    private $apiKey;
    private $senderId;

    public function __construct()
    {
        $this->apiKey = env('SEMAPHORE_API_KEY');
        $this->senderId = env('SEMAPHORE_SENDER_ID', 'ScholarSt');
    }

    public function sendOTP($phoneNumber)
    {
        // Generate 6-digit OTP
        $otp = random_int(100000, 999999);
        
        // Store OTP in cache for 5 minutes
        Cache::put("otp_{$phoneNumber}", $otp, 300);
        
        // Send SMS via Semaphore
        $response = Http::post('https://api.semaphore.co/api/v4/messages', [
            'apikey' => $this->apiKey,
            'number' => $phoneNumber,
            'message' => "Your ScholarStreet verification code is: {$otp}. Valid for 5 minutes.",
            'sendername' => $this->senderId
        ]);

        return [
            'success' => $response->successful(),
            'message' => $response->successful() ? 'OTP sent successfully' : 'Failed to send OTP'
        ];
    }

    public function verifyOTP($phoneNumber, $inputOTP)
    {
        $storedOTP = Cache::get("otp_{$phoneNumber}");
        
        if ($storedOTP && $storedOTP == $inputOTP) {
            Cache::forget("otp_{$phoneNumber}"); // Clear OTP
            return true;
        }
        
        return false;
    }
}
```

### **Step 3: Controller for OTP Registration**
```php
// app/Http/Controllers/Auth/RegisterController.php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SemaphoreService;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    protected $semaphore;

    public function __construct(SemaphoreService $semaphore)
    {
        $this->semaphore = $semaphore;
    }

    public function sendOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required|regex:/^09[0-9]{9}$/' // PH mobile format
        ]);

        $result = $this->semaphore->sendOTP($request->phone);
        
        return response()->json($result);
    }

    public function verifyOTP(Request $request)
    {
        $request->validate([
            'phone' => 'required',
            'otp' => 'required|digits:6'
        ]);

        $isValid = $this->semaphore->verifyOTP($request->phone, $request->otp);
        
        if ($isValid) {
            // Mark phone as verified, proceed with registration
            session(['phone_verified' => true, 'verified_phone' => $request->phone]);
            return response()->json(['success' => true, 'message' => 'Phone verified!']);
        }
        
        return response()->json(['success' => false, 'message' => 'Invalid OTP']);
    }
}
```

### **Step 4: Environment Configuration**
```env
# .env file
SEMAPHORE_API_KEY=your_semaphore_api_key_here
SEMAPHORE_SENDER_ID=ScholarSt
```

### **Step 5: Registration Flow with OTP**
```php
// Registration route
Route::post('/send-otp', [RegisterController::class, 'sendOTP']);
Route::post('/verify-otp', [RegisterController::class, 'verifyOTP']);

// In your registration form
public function register(Request $request)
{
    // Check if phone was verified
    if (!session('phone_verified')) {
        return back()->withErrors(['phone' => 'Please verify your phone number first']);
    }

    // Proceed with normal registration
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'phone' => session('verified_phone'),
        'password' => Hash::make($request->password),
        'phone_verified_at' => now()
    ]);

    Auth::login($user);
    return redirect('/dashboard');
}
```

---

## 🎯 **Complete Integration Example**

### **Your ScholarStreet Registration Flow:**
```php
// 1. User enters BSU email + phone number
// 2. System sends OTP via Semaphore
// 3. User enters OTP
// 4. System creates account
// 5. User can now apply for scholarships
// 6. File uploads handled by Laravel Storage
// 7. Applications stored with stored procedures
```

---

## ✅ **Summary - All Your Requirements Are Covered:**

### **📊 Stored Procedures:** 
✅ Laravel supports them perfectly with `DB::select()` and `DB::statement()`

### **📁 File Uploads:** 
✅ Laravel has built-in file upload - no external APIs needed

### **📱 SMS OTP:** 
✅ Laravel can integrate with Semaphore API easily using HTTP client

### **🔧 Additional Laravel Features You Get:**
- ✅ **Email notifications** (built-in Mail system)
- ✅ **Authentication** (Breeze/Sanctum)
- ✅ **Database migrations** (version control for DB)
- ✅ **Form validation** (built-in validation rules)
- ✅ **Session management** (for OTP storage)
- ✅ **File storage** (local, S3, etc.)

## 🚀 **Your Project is 100% Achievable with Laravel!**

All your requirements are either built into Laravel or easily implementable. You won't need any external services except Semaphore for SMS - everything else Laravel handles natively! 💪