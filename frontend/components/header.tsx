"use client";

import { Building2, LogOut, User, ChevronDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 shadow-lg mb-12">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Peach Tree Bank</h1>
              <p className="text-emerald-100 text-sm">
                Transaction Management System
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              {/* Account Balance Card */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm h-12 rounded-md">
                <CardContent className="p-0 h-full">
                  <div className="flex items-center space-x-6 h-full px-6">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-100 font-medium leading-tight">Balance</p>
                      <p className="text-sm font-bold text-white leading-tight">
                        ${parseFloat(user.balance).toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  variant="ghost"
                  className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white h-12 px-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{user.username}</p>
                      {user.full_name && (
                        <p className="text-xs text-emerald-100">{user.full_name}</p>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </div>
                </Button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <Card className="absolute right-0 top-full mt-2 w-64 bg-white border shadow-lg z-50">
                    <CardContent className="p-0">
                      <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-100 p-3 rounded-full">
                            <User className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.username}</p>
                            {user.full_name && (
                              <p className="text-sm text-gray-600">{user.full_name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <div className="p-3 bg-emerald-50 rounded-lg mb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-emerald-700 font-medium">Current Balance</span>
                            <span className="text-lg font-bold text-emerald-800">
                              ${parseFloat(user.balance).toLocaleString('en-US', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <Button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
