export const getRoleLabel = (role: string) => {
    switch(role) {
      case "BROKER": return "Courtier";
      case "PROVIDER": return "Apporteur";
      case "ADMIN": return "Admin";
      default: return "";
    }
  };