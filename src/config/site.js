export const SITE = {
  brandName: "Fuktech",
  phone: "+38972600236",//TODO: PLACE CORRECT INFO
  email: "fuktech27@gmail.com",
  socials: {
    instagram: "https://instagram.com/your_instagram",
    facebook: "https://facebook.com/your_facebook",
  },
  whatsAppLink(message = "Hello! I found you via your website and want to ask about your machinery.") {
    const number = this.phone.replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  },
};
