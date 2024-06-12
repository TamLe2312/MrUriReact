const VietnameseToxic = (text) => {
  try {
    const toxics = ["toxic", "từ toxic"];
    const checks = toxics.some((word) =>
      text.toLowerCase().includes(word.toLowerCase())
    );
    return checks;
  } catch (e) {
    console.log(e);
  }
};

export { VietnameseToxic };
