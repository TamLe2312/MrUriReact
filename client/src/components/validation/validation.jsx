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
  }

  return errors;
};

export default Validation;
