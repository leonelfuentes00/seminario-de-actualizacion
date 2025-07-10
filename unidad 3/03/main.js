import './pricingcomponent.js';

const plans = [
  {
    name: "Basic",
    price: "$ 10",
    period: "per month",
    color: "w3-black",
    features: [
      { bold: "10GB", text: "Storage" },
      { bold: "10", text: "Emails" },
      { bold: "10", text: "Domains" },
      { bold: "Endless", text: "Support" }
    ]
  },
  {
    name: "Pro",
    price: "$ 25",
    period: "per month",
    color: "w3-green",
    features: [
      { bold: "25GB", text: "Storage" },
      { bold: "25", text: "Emails" },
      { bold: "25", text: "Domains" },
      { bold: "Endless", text: "Support" }
    ]
  },
  {
    name: "Premium",
    price: "$ 50",
    period: "per month",
    color: "w3-black",
    features: [
      { bold: "50GB", text: "Storage" },
      { bold: "50", text: "Emails" },
      { bold: "50", text: "Domains" },
      { bold: "Endless", text: "Support" }
    ]
  }
];

document.querySelector('plan-list').data = plans;
