"""
Backend API Testing for Microsoft-style Authentication
Tests all authentication endpoints with comprehensive scenarios
"""

import requests
import json
from datetime import datetime

# Backend URL from environment
BACKEND_URL = "https://dev-assistant-80.preview.emergentagent.com/api"

# Test data - using realistic data
TEST_USER = {
    "email": "sarah.johnson@techcorp.com",
    "password": "SecurePass2024!",
    "name": "Sarah Johnson"
}

DUPLICATE_EMAIL = TEST_USER["email"]
NON_EXISTENT_EMAIL = "nobody@nowhere.com"
WRONG_PASSWORD = "WrongPassword123!"

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test_header(test_name):
    """Print a formatted test header."""
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST: {test_name}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")

def print_success(message):
    """Print success message."""
    print(f"{GREEN}✓ {message}{RESET}")

def print_error(message):
    """Print error message."""
    print(f"{RED}✗ {message}{RESET}")

def print_info(message):
    """Print info message."""
    print(f"{YELLOW}ℹ {message}{RESET}")

def print_response(response):
    """Print formatted response."""
    print(f"\nStatus Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

# Global variable to store token
auth_token = None

def test_1_user_registration():
    """Test 1: User Registration with valid data"""
    print_test_header("1. User Registration - Valid Data")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=TEST_USER,
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 201:
            print_error(f"Expected status 201, got {response.status_code}")
            # Check if it's 200 (some implementations use 200)
            if response.status_code == 200:
                print_info("Got 200 instead of 201 - acceptable for registration")
            else:
                return False
        else:
            print_success("Status code 201 ✓")
        
        # Verify response structure
        data = response.json()
        
        if not data.get("success"):
            print_error("Response does not have success=true")
            return False
        print_success("success=true ✓")
        
        if "token" not in data:
            print_error("Response does not contain token")
            return False
        print_success("Token present ✓")
        
        # Store token for later tests
        global auth_token
        auth_token = data["token"]
        
        if "user" not in data:
            print_error("Response does not contain user data")
            return False
        print_success("User data present ✓")
        
        user = data["user"]
        
        # Verify password is not in response
        if "password" in user or "password_hash" in user:
            print_error("Password found in response - SECURITY ISSUE!")
            return False
        print_success("Password not in response ✓")
        
        # Verify user fields
        if user.get("email") != TEST_USER["email"].lower():
            print_error(f"Email mismatch: expected {TEST_USER['email'].lower()}, got {user.get('email')}")
            return False
        print_success(f"Email correct: {user.get('email')} ✓")
        
        if user.get("name") != TEST_USER["name"]:
            print_error(f"Name mismatch: expected {TEST_USER['name']}, got {user.get('name')}")
            return False
        print_success(f"Name correct: {user.get('name')} ✓")
        
        print_success("✓ User Registration Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_2_duplicate_email():
    """Test 2: User Registration with duplicate email"""
    print_test_header("2. User Registration - Duplicate Email")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/register",
            json=TEST_USER,
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 400:
            print_error(f"Expected status 400, got {response.status_code}")
            return False
        print_success("Status code 400 ✓")
        
        # Verify error message
        data = response.json()
        detail = data.get("detail", "")
        
        if "already taken" not in detail.lower():
            print_error(f"Expected 'already taken' in error message, got: {detail}")
            return False
        print_success(f"Error message correct: {detail} ✓")
        
        print_success("✓ Duplicate Email Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_3_email_check_existing():
    """Test 3: Email Check - Existing Email"""
    print_test_header("3. Email Check - Existing Email")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/check-email",
            json={"email": TEST_USER["email"]},
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 200:
            print_error(f"Expected status 200, got {response.status_code}")
            return False
        print_success("Status code 200 ✓")
        
        # Verify response
        data = response.json()
        
        if not data.get("exists"):
            print_error("Expected exists=true for existing email")
            return False
        print_success("exists=true ✓")
        
        print_success("✓ Email Check (Existing) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_4_email_check_non_existing():
    """Test 4: Email Check - Non-existing Email"""
    print_test_header("4. Email Check - Non-existing Email")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/check-email",
            json={"email": NON_EXISTENT_EMAIL},
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 200:
            print_error(f"Expected status 200, got {response.status_code}")
            return False
        print_success("Status code 200 ✓")
        
        # Verify response
        data = response.json()
        
        if data.get("exists"):
            print_error("Expected exists=false for non-existing email")
            return False
        print_success("exists=false ✓")
        
        print_success("✓ Email Check (Non-existing) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_5_login_correct_credentials():
    """Test 5: User Login - Correct Credentials"""
    print_test_header("5. User Login - Correct Credentials")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            },
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 200:
            print_error(f"Expected status 200, got {response.status_code}")
            return False
        print_success("Status code 200 ✓")
        
        # Verify response structure
        data = response.json()
        
        if not data.get("success"):
            print_error("Response does not have success=true")
            return False
        print_success("success=true ✓")
        
        if "token" not in data:
            print_error("Response does not contain token")
            return False
        print_success("Token present ✓")
        
        # Update global token
        global auth_token
        auth_token = data["token"]
        
        if "user" not in data:
            print_error("Response does not contain user data")
            return False
        print_success("User data present ✓")
        
        user = data["user"]
        
        # Verify password is not in response
        if "password" in user or "password_hash" in user:
            print_error("Password found in response - SECURITY ISSUE!")
            return False
        print_success("Password not in response ✓")
        
        print_success("✓ Login (Correct Credentials) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_6_login_wrong_password():
    """Test 6: User Login - Wrong Password"""
    print_test_header("6. User Login - Wrong Password")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": WRONG_PASSWORD
            },
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 401:
            print_error(f"Expected status 401, got {response.status_code}")
            return False
        print_success("Status code 401 ✓")
        
        # Verify error message exists
        data = response.json()
        if "detail" not in data:
            print_error("No error message in response")
            return False
        print_success(f"Error message present: {data['detail']} ✓")
        
        print_success("✓ Login (Wrong Password) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_7_login_non_existent_email():
    """Test 7: User Login - Non-existent Email"""
    print_test_header("7. User Login - Non-existent Email")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={
                "email": NON_EXISTENT_EMAIL,
                "password": "anything"
            },
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 401:
            print_error(f"Expected status 401, got {response.status_code}")
            return False
        print_success("Status code 401 ✓")
        
        print_success("✓ Login (Non-existent Email) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_8_forgot_password():
    """Test 8: Password Reset Request"""
    print_test_header("8. Password Reset Request")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/forgot-password",
            json={"email": TEST_USER["email"]},
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 200:
            print_error(f"Expected status 200, got {response.status_code}")
            return False
        print_success("Status code 200 ✓")
        
        # Verify response
        data = response.json()
        
        if not data.get("success"):
            print_error("Expected success=true")
            return False
        print_success("success=true ✓")
        
        if "message" not in data:
            print_error("No message in response")
            return False
        print_success(f"Message present: {data['message']} ✓")
        
        print_success("✓ Password Reset Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_9_get_current_user_valid_token():
    """Test 9: Get Current User - Valid Token"""
    print_test_header("9. Get Current User - Valid Token")
    
    if not auth_token:
        print_error("No auth token available. Previous tests may have failed.")
        return False
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 200:
            print_error(f"Expected status 200, got {response.status_code}")
            return False
        print_success("Status code 200 ✓")
        
        # Verify response
        data = response.json()
        
        if "email" not in data:
            print_error("No email in response")
            return False
        print_success(f"Email present: {data['email']} ✓")
        
        if "name" not in data:
            print_error("No name in response")
            return False
        print_success(f"Name present: {data['name']} ✓")
        
        # Verify password is not in response
        if "password" in data or "password_hash" in data:
            print_error("Password found in response - SECURITY ISSUE!")
            return False
        print_success("Password not in response ✓")
        
        print_success("✓ Get Current User (Valid Token) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def test_10_get_current_user_invalid_token():
    """Test 10: Get Current User - Invalid Token"""
    print_test_header("10. Get Current User - Invalid Token")
    
    try:
        response = requests.get(
            f"{BACKEND_URL}/auth/me",
            headers={"Authorization": "Bearer invalid_token_12345"},
            timeout=10
        )
        
        print_response(response)
        
        # Verify status code
        if response.status_code != 401:
            print_error(f"Expected status 401, got {response.status_code}")
            return False
        print_success("Status code 401 ✓")
        
        print_success("✓ Get Current User (Invalid Token) Test PASSED")
        return True
        
    except requests.exceptions.RequestException as e:
        print_error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        print_error(f"Test failed: {str(e)}")
        return False

def run_all_tests():
    """Run all authentication tests."""
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}MICROSOFT-STYLE AUTHENTICATION API TESTS{RESET}")
    print(f"{BLUE}Backend URL: {BACKEND_URL}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    tests = [
        ("User Registration - Valid Data", test_1_user_registration),
        ("User Registration - Duplicate Email", test_2_duplicate_email),
        ("Email Check - Existing Email", test_3_email_check_existing),
        ("Email Check - Non-existing Email", test_4_email_check_non_existing),
        ("User Login - Correct Credentials", test_5_login_correct_credentials),
        ("User Login - Wrong Password", test_6_login_wrong_password),
        ("User Login - Non-existent Email", test_7_login_non_existent_email),
        ("Password Reset Request", test_8_forgot_password),
        ("Get Current User - Valid Token", test_9_get_current_user_valid_token),
        ("Get Current User - Invalid Token", test_10_get_current_user_invalid_token),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_error(f"Test '{test_name}' crashed: {str(e)}")
            results.append((test_name, False))
    
    # Print summary
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        if result:
            print_success(f"{test_name}")
        else:
            print_error(f"{test_name}")
    
    print(f"\n{BLUE}{'='*80}{RESET}")
    if passed == total:
        print(f"{GREEN}ALL TESTS PASSED: {passed}/{total}{RESET}")
    else:
        print(f"{RED}TESTS FAILED: {total - passed}/{total} failed, {passed}/{total} passed{RESET}")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
