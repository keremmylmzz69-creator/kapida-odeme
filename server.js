const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SHOP = process.env.SHOP;
const TOKEN = process.env.TOKEN;

app.post("/kapida-odeme", async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      productVariant,
      codVariant
    } = req.body;

    await axios.post(
      `https://${SHOP}/admin/api/2024-01/draft_orders.json`,
      {
        draft_order: {
          line_items: [
            { variant_id: productVariant, quantity: 1 },
            { variant_id: codVariant, quantity: 1 }
          ],
          shipping_address: {
            name,
            phone,
            address1: address,
            city,
            country: "Turkey"
          },
          note: "Kapıda Ödeme Siparişi",
          tags: "Kapıda Ödeme",
          payment_terms: {
            payment_terms_name: "Due on receipt"
          }
        }
      },
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Kapıda ödeme sistemi çalışıyor");
});
