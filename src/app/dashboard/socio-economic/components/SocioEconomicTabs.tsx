"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SocioEconomicTabs() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const isActive = (href: string) => pathname === href;
  const isSection = (prefix: string) => pathname.startsWith(prefix);

  const toggleDropdown = useCallback((dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Handle click outside with a slight delay to improve UX
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleClickOutside = (event: MouseEvent) => {
      if (!openDropdown) return;

      const target = event.target as Node;
      const currentDropdownRef = dropdownRefs.current[openDropdown];
      const currentButtonRef = buttonRefs.current[openDropdown];

      if (
        currentDropdownRef &&
        !currentDropdownRef.contains(target) &&
        currentButtonRef &&
        !currentButtonRef.contains(target)
      ) {
        timeoutId = setTimeout(() => {
          closeDropdown();
        }, 100); // Slight delay to prevent accidental closure
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, closeDropdown]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDropdown) {
        closeDropdown();
        buttonRefs.current[openDropdown]?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [openDropdown, closeDropdown]);

  const DropdownButton = ({
    name,
    children,
    section,
  }: {
    name: string;
    children: React.ReactNode;
    section: string;
  }) => (
    <button
      ref={(el) => {
        buttonRefs.current[name] = el;
      }}
      onClick={() => toggleDropdown(name)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDropdown(name);
        }
      }}
      className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
        isSection(section) ? "text-[#54D12B]" : "text-gray-600 hover:text-black"
      }`}
      aria-expanded={openDropdown === name}
      aria-haspopup="true"
      aria-controls={`dropdown-${name}`}
    >
      {children}
      <svg
        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
          openDropdown === name ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
      {isSection(section) && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
      )}
    </button>
  );

  const DropdownMenu = ({
    name,
    children,
  }: {
    name: string;
    children: React.ReactNode;
  }) => (
    <div
      id={`dropdown-${name}`}
      ref={(el) => {
        dropdownRefs.current[name] = el;
      }}
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[240px] z-[50000] transition-all duration-300 ease-out ${
        openDropdown === name
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-1 pointer-events-none"
      }`}
      style={{
        position: "fixed",
        top: buttonRefs.current[name]?.getBoundingClientRect().bottom || 0,
        left: buttonRefs.current[name]?.getBoundingClientRect().left || 0,
      }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={`dropdown-button-${name}`}
    >
      <div className="overflow-hidden rounded-lg">{children}</div>
    </div>
  );

  const DropdownLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm text-gray-700 transition-all duration-200 border-l-2 border-transparent hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:border-[#54D12B] ${
        isActive(href) ? "border-[#54D12B] text-gray-900 font-medium" : ""
      }`}
      onClick={onClick}
      role="menuitem"
      tabIndex={0}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            isActive(href) ? "bg-[#54D12B]" : "bg-gray-400"
          }`}
        ></div>
        <span>{children}</span>
      </div>
    </Link>
  );

  return (
    <div className="sticky top-0 bg-white z-[9999]">
      <div className="max-w-7xl mx-auto px-8 pt-7 relative">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Socio-Economic
          </h1>
        </div>

        <div className="relative overflow-visible">
          <div className="flex whitespace-nowrap gap-6 border-b border-gray-200 overflow-x-auto overflow-y-visible no-scrollbar">
            <Link
              href="/dashboard/socio-economic"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Livestock
              {isActive("/dashboard/socio-economic") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <div className="relative">
              <DropdownButton
                name="housing"
                section="/dashboard/socio-economic/housing"
              >
                Housing
              </DropdownButton>
              <DropdownMenu name="housing">
                <DropdownLink
                  href="/dashboard/socio-economic/housing/materials"
                  onClick={closeDropdown}
                >
                  Materials
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/housing/houses"
                  onClick={closeDropdown}
                >
                  Houses
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/housing/repairments"
                  onClick={closeDropdown}
                >
                  Repairments
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/housing/villages"
                  onClick={closeDropdown}
                >
                  Villages
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/housing/toilets"
                  onClick={closeDropdown}
                >
                  Toilets
                </DropdownLink>
              </DropdownMenu>
            </div>

            <div className="relative">
              <DropdownButton
                name="empowerment"
                section="/dashboard/socio-economic/empowerment"
              >
                Empowerment
              </DropdownButton>
              <DropdownMenu name="empowerment">
                <DropdownLink
                  href="/dashboard/socio-economic/empowerment/micro-finance"
                  onClick={closeDropdown}
                >
                  Micro-Finance
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/empowerment/tailoring"
                  onClick={closeDropdown}
                >
                  Tailoring
                </DropdownLink>
              </DropdownMenu>
            </div>

            <div className="relative">
              <DropdownButton
                name="education"
                section="/dashboard/socio-economic/education"
              >
                Education
              </DropdownButton>
              <DropdownMenu name="education">
                <DropdownLink
                  href="/dashboard/socio-economic/education/materials"
                  onClick={closeDropdown}
                >
                  Materials
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/education/infrastructures"
                  onClick={closeDropdown}
                >
                  Infrastructures
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/education/students"
                  onClick={closeDropdown}
                >
                  Supported Students
                </DropdownLink>
                <DropdownLink
                  href="/dashboard/socio-economic/education/students/archived"
                  onClick={closeDropdown}
                >
                  Archived Students
                </DropdownLink>
              </DropdownMenu>
            </div>

            <Link
              href="/dashboard/socio-economic/health-centres"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/health-centres")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Health Centres
              {isActive("/dashboard/socio-economic/health-centres") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/it-centre"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/it-centre")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              IT Centre
              {isActive("/dashboard/socio-economic/it-centre") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/sports"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/sports")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Sports
              {isActive("/dashboard/socio-economic/sports") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/parking"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/parking")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Parking
              {isActive("/dashboard/socio-economic/parking") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/water-pumps"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/water-pumps")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Water Pumps
              {isActive("/dashboard/socio-economic/water-pumps") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/offices"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/offices")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Offices
              {isActive("/dashboard/socio-economic/offices") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>

            <Link
              href="/dashboard/socio-economic/workers"
              className={`pb-4 px-4 font-medium text-sm transition-all duration-200 relative flex-shrink-0 rounded-md focus:outline-none focus:ring-2 focus:ring-[#54D12B] focus:ring-offset-2 ${
                isActive("/dashboard/socio-economic/workers")
                  ? "text-[#54D12B]"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Workers
              {isActive("/dashboard/socio-economic/workers") && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#54D12B]"></div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}