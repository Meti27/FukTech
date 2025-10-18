export const SITE = {
  brandName: "Fuktech",
  phone: "+38970000000",//TODO: PLACE CORRECT INFO
  email: "client@example.com",
  socials: {
    instagram: "https://instagram.com/your_instagram",
    facebook: "https://facebook.com/your_facebook",
  },
  whatsAppLink(message = "Hello! I found you via your website and want to ask about your machinery.") {
    const number = this.phone.replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  },
};
