/**
 * Vietnam Address Manager
 * Handles loading and managing Vietnamese address data (provinces, districts, wards)
 */

class VietnamAddressManager {
  constructor() {
    this.addressData = [];
    this.isLoaded = false;
  }

  // Load address data from JSON file
  async loadAddressData() {
    if (this.isLoaded) {
      return this.addressData;
    }

    try {
      const response = await fetch("assets/db/vietnam_addresses.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.addressData = await response.json();
      this.isLoaded = true;
      console.log("Vietnam address data loaded successfully");
      return this.addressData;
    } catch (error) {
      console.error("Error loading Vietnam address data:", error);
      // Fallback to basic data if JSON fails
      this.addressData = this.getFallbackData();
      this.isLoaded = true;
      return this.addressData;
    }
  }

  // Get all provinces
  getProvinces() {
    return this.addressData.map((province) => ({
      code: province.code,
      name: province.name,
      codename: province.codename,
    }));
  }

  // Get districts by province code
  getDistricts(provinceCode) {
    const province = this.addressData.find((p) => p.code == provinceCode);
    if (!province || !province.districts) {
      return [];
    }

    return province.districts.map((district) => ({
      code: district.code,
      name: district.name,
      codename: district.codename,
      short_codename: district.short_codename,
    }));
  }

  // Get wards by district code and province code
  getWards(provinceCode, districtCode) {
    const province = this.addressData.find((p) => p.code == provinceCode);
    if (!province || !province.districts) {
      return [];
    }

    const district = province.districts.find((d) => d.code == districtCode);
    if (!district || !district.wards) {
      return [];
    }

    return district.wards.map((ward) => ({
      code: ward.code,
      name: ward.name,
      codename: ward.codename,
      short_codename: ward.short_codename,
    }));
  }

  // Get province name by code
  getProvinceName(provinceCode) {
    const province = this.addressData.find((p) => p.code == provinceCode);
    return province ? province.name : "";
  }

  // Get district name by codes
  getDistrictName(provinceCode, districtCode) {
    const province = this.addressData.find((p) => p.code == provinceCode);
    if (!province || !province.districts) {
      return "";
    }

    const district = province.districts.find((d) => d.code == districtCode);
    return district ? district.name : "";
  }

  // Get ward name by codes
  getWardName(provinceCode, districtCode, wardCode) {
    const province = this.addressData.find((p) => p.code == provinceCode);
    if (!province || !province.districts) {
      return "";
    }

    const district = province.districts.find((d) => d.code == districtCode);
    if (!district || !district.wards) {
      return "";
    }

    const ward = district.wards.find((w) => w.code == wardCode);
    return ward ? ward.name : "";
  }

  // Populate select element with options
  populateSelect(selectElement, options, defaultText = "Chọn...") {
    // Clear existing options
    selectElement.innerHTML = "";

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultText;
    defaultOption.hidden = true;
    selectElement.appendChild(defaultOption);

    // Add options
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.code;
      optionElement.textContent = option.name;
      selectElement.appendChild(optionElement);
    });
  }

  // Initialize address selectors on checkout page
  async initializeCheckoutSelectors() {
    await this.loadAddressData();

    const provinceSelect = document.getElementById("billingProvince");
    const districtSelect = document.getElementById("billingDistrict");
    const wardSelect = document.getElementById("billingWard");

    if (!provinceSelect) {
      console.warn("Province select element not found");
      return;
    }

    // Populate provinces
    const provinces = this.getProvinces();
    this.populateSelect(provinceSelect, provinces, "---");

    // Handle province change
    provinceSelect.addEventListener("change", (e) => {
      const provinceCode = e.target.value;

      if (provinceCode) {
        // Enable and populate districts
        const districts = this.getDistricts(provinceCode);
        if (districtSelect) {
          districtSelect.disabled = false;
          this.populateSelect(districtSelect, districts, "Chọn quận/huyện");
        }

        // Clear and disable wards
        if (wardSelect) {
          wardSelect.disabled = true;
          wardSelect.innerHTML = "";
        }
      } else {
        // Disable and clear districts and wards
        if (districtSelect) {
          districtSelect.disabled = true;
          districtSelect.innerHTML = "";
        }
        if (wardSelect) {
          wardSelect.disabled = true;
          wardSelect.innerHTML = "";
        }
      }
    });

    // Handle district change (if ward selector exists)
    if (districtSelect && wardSelect) {
      districtSelect.addEventListener("change", (e) => {
        const districtCode = e.target.value;
        const provinceCode = provinceSelect.value;

        if (districtCode && provinceCode) {
          // Enable and populate wards
          const wards = this.getWards(provinceCode, districtCode);
          wardSelect.disabled = false;
          this.populateSelect(wardSelect, wards, "Chọn phường/xã");
        } else {
          // Clear and disable wards
          wardSelect.disabled = true;
          wardSelect.innerHTML = "";
        }
      });
    }

    console.log("Address selectors initialized successfully");
  }

  // Fallback data in case JSON loading fails
  getFallbackData() {
    return [
      {
        name: "Thành phố Hà Nội",
        code: 1,
        districts: [
          { name: "Quận Ba Đình", code: 1 },
          { name: "Quận Hoàn Kiếm", code: 2 },
          { name: "Quận Đống Đa", code: 3 },
          { name: "Quận Hai Bà Trưng", code: 4 },
        ],
      },
      {
        name: "Thành phố Hồ Chí Minh",
        code: 79,
        districts: [
          { name: "Quận 1", code: 760 },
          { name: "Quận 2", code: 761 },
          { name: "Quận 3", code: 762 },
          { name: "Quận 4", code: 763 },
        ],
      },
      {
        name: "Tỉnh An Giang",
        code: 89,
        districts: [
          { name: "Thành phố Long Xuyên", code: 883 },
          { name: "Thành phố Châu Đốc", code: 884 },
        ],
      },
    ];
  }

  // Search provinces by name
  searchProvinces(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    return this.getProvinces().filter(
      (province) =>
        province.name.toLowerCase().includes(term) ||
        province.codename.toLowerCase().includes(term)
    );
  }

  // Search districts by name within a province
  searchDistricts(provinceCode, searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    return this.getDistricts(provinceCode).filter(
      (district) =>
        district.name.toLowerCase().includes(term) ||
        district.codename.toLowerCase().includes(term)
    );
  }

  // Get full address string
  getFullAddress(provinceCode, districtCode, wardCode, street = "") {
    const parts = [];

    if (street) parts.push(street);
    if (wardCode)
      parts.push(this.getWardName(provinceCode, districtCode, wardCode));
    if (districtCode)
      parts.push(this.getDistrictName(provinceCode, districtCode));
    if (provinceCode) parts.push(this.getProvinceName(provinceCode));

    return parts.filter((part) => part).join(", ");
  }
}

// Create global instance
window.vietnamAddressManager = new VietnamAddressManager();

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize on checkout page
  if (document.getElementById("billingProvince")) {
    window.vietnamAddressManager.initializeCheckoutSelectors();
  }
});
