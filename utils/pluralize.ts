export const pluralize = (word: string): string => {
    if (word.endsWith("y")) {
      return word.slice(0, -1) + "ies"; // Mengganti 'y' dengan 'ies'
    }
    return word + "s"; // Tambahkan 's' untuk kata lainnya
  };
  