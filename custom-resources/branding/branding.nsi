# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# NSIS branding defines for Silicium

# BrandFullNameInternal is used for some registry and file system values
# instead of BrandFullName and typically should not be modified.
!define BrandFullNameInternal "Silicium Browser"
!define CompanyName           "SiliciumBrowser"
!define URLInfoAbout          "https://github.com/SiliciumBrowser"
!define URLUpdateInfo         "https://github.com/SiliciumBrowser/releases"
!define HelpLink              "https://github.com/SiliciumBrowser/wiki"

!define URLStubDownloadX86 "https://github.com/SiliciumBrowser/releases"
!define URLStubDownloadAMD64 "https://github.com/SiliciumBrowser/releases"
!define URLStubDownloadAArch64 "https://github.com/SiliciumBrowser/releases"
!define URLManualDownload "https://github.com/SiliciumBrowser/releases"
!define URLSystemRequirements "https://github.com/SiliciumBrowser/wiki/requirements"
!define Channel "release"

# The installer's certificate name and issuer expected by the stub installer
!define CertNameDownload   "SiliciumBrowser"
!define CertIssuerDownload "SiliciumBrowser"

# Dialog units are used so the UI displays correctly with the system's DPI
# settings.
!define PROFILE_CLEANUP_LABEL_TOP "35u"
!define PROFILE_CLEANUP_LABEL_LEFT "0"
!define PROFILE_CLEANUP_LABEL_WIDTH "100%"
!define PROFILE_CLEANUP_LABEL_HEIGHT "80u"

!define PROFILE_CLEANUP_CHECKBOX_LEFT "0"
!define PROFILE_CLEANUP_CHECKBOX_WIDTH "100%"
!define PROFILE_CLEANUP_BUTTON_LEFT "0"
