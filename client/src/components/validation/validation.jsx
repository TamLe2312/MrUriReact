const Validation = (value, type) => {
  let errors = {};

  if (type === "usersRegister") {
    if (!value.username) {
      errors.username = "Username cannot be empty";
    }
    if (!value.email) {
      errors.email = "Email cannot be empty";
    }
    if (value.email) {
      let regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(value.email)) {
        errors.email = "Email invalid";
      }
    }
    if (!value.password) {
      errors.password = "Password cannot be empty";
    }
    if (!value.confirmPassword) {
      errors.confirmPassword = "Confirm password cannot be empty";
    }
    if (value.password !== value.confirmPassword) {
      errors.confirmPassword = "Password must be the same";
    }
  } else if (type === "products") {
    if (!value.productName) {
      errors.productName = "Product name cannot be empty";
    }
    if (!value.productDescription) {
      errors.productDescription = "Product description cannot be empty";
    }
    if (!value.stock) {
      errors.stock = "Stock cannot be empty";
    } else if (isNaN(value.stock)) {
      errors.stock = "Stock must be a number";
    }
    if (!value.importedPrice) {
      errors.importedPrice = "Imported price cannot be empty";
    } else if (isNaN(value.importedPrice)) {
      errors.importedPrice = "Imported price must be a number";
    }
    if (!value.sellingPrice) {
      errors.sellingPrice = "Selling price cannot be empty";
    } else if (isNaN(value.sellingPrice)) {
      errors.sellingPrice = "Selling price must be a number";
    }
    if (!value.status) {
      errors.status = "Status cannot be empty";
    }
  } else if (type === "usersLogin") {
    if (!value.username) {
      errors.username = "Username cannot be empty";
    }
    if (!value.password) {
      errors.password = "Password cannot be empty";
    }
  } else if (type === "categories") {
    if (!value.categoryName) {
      errors.categoryName = "Category name cannot be empty";
    }
    if (!value.categorySlug) {
      errors.categorySlug = "Category slug cannot be empty";
    }
  } else if (type === "check-out") {
    if (!value.name) {
      errors.name = "Name cannot be empty";
    }
    if (!value.phoneNumber) {
      errors.phoneNumber = "Phone number cannot be empty";
    }
    if (!value.address) {
      errors.address = "Address cannot be empty";
    }
    if (!value.provinces) {
      errors.provinces = "Province cannot be empty";
    }
    if (!value.districts) {
      errors.districts = "District cannot be empty";
    }
    if (!value.wards) {
      errors.wards = "Ward cannot be empty";
    }
    if (!value.paymentMethod) {
      errors.paymentMethod = "Payment method cannot be empty";
    }
  } else if (type === "forgot-password") {
    if (!value.email) {
      errors.email = "Email cannot be empty";
    }
    if (value.email) {
      let regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(value.email)) {
        errors.email = "Email invalid";
      }
    }
  } else if (type === "verify-token") {
    if (!value.password) {
      errors.password = "Password cannot be empty";
    }
    if (!value.confirmPassword) {
      errors.confirmPassword = "Confirm password cannot be empty";
    }
    if (value.password !== value.confirmPassword) {
      errors.confirmPassword = "Password must be the same";
    }
  } else if (type === "orders") {
    if (!value.address) {
      errors.address = "Address cannot be empty";
    }
  } else if (type === "editProduct") {
    if (!value.product_name) {
      errors.product_name = "Product name cannot be empty";
    }
    if (!value.stock) {
      errors.stock = "Stock cannot be empty";
    }
    if (!value.product_description) {
      errors.product_description = "Product description cannot be empty";
    }
    if (!value.selling_price) {
      errors.selling_price = "Selling price cannot be empty";
    }
    if (!value.imported_price) {
      errors.imported_price = "Imported price cannot be empty";
    }
  } else if (type === "informWithPassword") {
    if (!value.currentPassword) {
      errors.currentPassword = "Current password cannot be empty";
    }
    if (!value.newPassword) {
      errors.newPassword = "New password cannot be empty";
    }
    if (value.newPassword !== value.confirmPassword) {
      errors.confirmPassword = "Password must be the same";
    }
  } else if (type === "informWithoutPassword") {
    if (!value.username) {
      errors.username = "Username cannot be empty";
    }
    if (!value.name) {
      errors.name = "Name cannot be empty";
    }
    if (!value.email) {
      errors.email = "Email cannot be empty";
    }
    if (value.email) {
      let regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regex.test(value.email)) {
        errors.email = "Email invalid";
      }
    }
  }

  return errors;
};

export default Validation;
