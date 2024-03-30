const Validation = (value) => {
  let errors = {};

  if (!value.productName) errors.productName = "Product name cannot empty";
  if (!value.productDescription)
    errors.productDescription = "Product description cannot empty";
  if (!value.stock) {
    errors.stock = "Stock cannot empty";
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
  return errors;
};

export default Validation;
