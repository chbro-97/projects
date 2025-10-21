import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(null);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    if (password.length === 0) {
      setStrength(null);
      setChecks({});
      return;
    }

    const analysis = analyzePassword(password);
    setChecks(analysis.checks);
    setStrength(analysis.strength);
  }, [password]);

  const analyzePassword = (pwd) => {
    const checks = {
      minLength: pwd.length >= 8,
      maxLength: pwd.length <= 128,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
      noCommonPatterns: !checkCommonPatterns(pwd),
      noSequential: !checkSequentialChars(pwd),
      noRepeating: !checkRepeatingChars(pwd),
    };

    // OWASP recommends checking for breached passwords via API
    // For demo purposes, we check against common passwords
    checks.notCommon = !isCommonPassword(pwd);

    let score = 0;
    let passedCriteria = 0;

    // Minimum requirements (OWASP Level 1)
    if (checks.minLength) score += 15;
    if (checks.maxLength) score += 5;

    // Character diversity (OWASP Level 2)
    const diversityTypes = [
      checks.hasUppercase,
      checks.hasLowercase,
      checks.hasNumber,
      checks.hasSpecial
    ].filter(Boolean).length;

    if (diversityTypes >= 3) {
      score += 30;
      passedCriteria++;
    } else if (diversityTypes === 2) {
      score += 15;
    }

    // Length bonus (OWASP recommends 12+ chars)
    if (pwd.length >= 12) score += 15;
    if (pwd.length >= 16) score += 10;
    if (pwd.length >= 20) score += 10;

    // Pattern checks (OWASP Level 3)
    if (checks.noCommonPatterns) score += 10;
    if (checks.noSequential) score += 10;
    if (checks.noRepeating) score += 10;
    if (checks.notCommon) score += 15;

    // Determine strength level
    let strengthLevel;
    let strengthColor;
    let strengthText;

    if (score < 40) {
      strengthLevel = 'weak';
      strengthColor = 'text-red-600';
      strengthText = 'Weak';
    } else if (score < 60) {
      strengthLevel = 'fair';
      strengthColor = 'text-orange-500';
      strengthText = 'Fair';
    } else if (score < 80) {
      strengthLevel = 'good';
      strengthColor = 'text-yellow-500';
      strengthText = 'Good';
    } else {
      strengthLevel = 'strong';
      strengthColor = 'text-green-600';
      strengthText = 'Strong';
    }

    return {
      strength: {
        level: strengthLevel,
        score,
        color: strengthColor,
        text: strengthText
      },
      checks
    };
  };

  const checkCommonPatterns = (pwd) => {
    const patterns = [
      /^123+/i,
      /password/i,
      /qwerty/i,
      /abc+/i,
      /111+/,
      /000+/,
      /admin/i,
      /letmein/i,
      /welcome/i,
      /monkey/i,
      /dragon/i,
    ];
    return patterns.some(pattern => pattern.test(pwd));
  };

  const checkSequentialChars = (pwd) => {
    for (let i = 0; i < pwd.length - 2; i++) {
      const char1 = pwd.charCodeAt(i);
      const char2 = pwd.charCodeAt(i + 1);
      const char3 = pwd.charCodeAt(i + 2);
      if (char2 === char1 + 1 && char3 === char2 + 1) return true;
      if (char2 === char1 - 1 && char3 === char2 - 1) return true;
    }
    return false;
  };

  const checkRepeatingChars = (pwd) => {
    return /(.)\1{2,}/.test(pwd);
  };

  const isCommonPassword = (pwd) => {
    const common = [
      'password', '123456', '12345678', 'qwerty', 'abc123',
      'monkey', 'letmein', 'trustno1', 'dragon', 'baseball',
      'iloveyou', 'master', 'sunshine', 'ashley', 'bailey',
      'shadow', 'superman', 'qazwsx', 'michael', 'football'
    ];
    return common.some(c => pwd.toLowerCase().includes(c));
  };

  const CheckItem = ({ passed, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={passed ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </div>
  );

  const getStrengthBarColor = () => {
    if (!strength) return 'bg-gray-200';
    switch (strength.level) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getStrengthBarWidth = () => {
    if (!strength) return '0%';
    return `${strength.score}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Password Strength Checker</h1>
              <p className="text-sm text-gray-500">Based on OWASP Security Standards</p>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type your password here..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          {password.length > 0 && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  {strength && (
                    <span className={`text-sm font-semibold ${strength.color}`}>
                      {strength.text}
                    </span>
                  )}
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthBarColor()}`}
                    style={{ width: getStrengthBarWidth() }}
                  />
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  OWASP Requirements
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Basic Requirements</p>
                    <div className="space-y-2">
                      <CheckItem passed={checks.minLength} text="At least 8 characters" />
                      <CheckItem passed={checks.maxLength} text="Maximum 128 characters" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Character Diversity (3+ recommended)</p>
                    <div className="space-y-2">
                      <CheckItem passed={checks.hasUppercase} text="Contains uppercase letters (A-Z)" />
                      <CheckItem passed={checks.hasLowercase} text="Contains lowercase letters (a-z)" />
                      <CheckItem passed={checks.hasNumber} text="Contains numbers (0-9)" />
                      <CheckItem passed={checks.hasSpecial} text="Contains special characters (!@#$%)" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Security Checks</p>
                    <div className="space-y-2">
                      <CheckItem passed={checks.notCommon} text="Not a commonly used password" />
                      <CheckItem passed={checks.noCommonPatterns} text="No common patterns (123, abc, etc.)" />
                      <CheckItem passed={checks.noSequential} text="No sequential characters" />
                      <CheckItem passed={checks.noRepeating} text="No excessive repeating characters" />
                    </div>
                  </div>
                </div>
              </div>

              {/* OWASP Tips */}
              <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-indigo-900 mb-2">OWASP Best Practices</h4>
                <ul className="text-xs text-indigo-800 space-y-1">
                  <li>• Use passwords at least 12 characters long for better security</li>
                  <li>• Avoid personal information (names, birthdays, addresses)</li>
                  <li>• Use a unique password for each account</li>
                  <li>• Consider using a passphrase with random words</li>
                  <li>• Enable multi-factor authentication (MFA) when available</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}