export const SITE = {
  brandName: "Fuktech",
  phone: "+38972600236",//TODO: PLACE CORRECT INFO
   whatsapp: "+38971925000",
  email: "fuktech27@gmail.com",
  socials: {
    instagram: "https://instagram.com/your_instagram",//TODO change the correct info
    facebook: "https://facebook.com/your_facebook",
  },
   whatsAppLink(message = "Hello! I found you via your website and want to ask about your machinery.") {
    const number = this.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  },
};
