const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/order", async (req, res) => {
  console.log("POST /order geldi");

  const {
    variant_id,
    quantity,
    cod_fee_variant_id,
    name,
    phone,
    address
  } = req.body;

  try {
    const response = await fetch(
      "https://pipetshop.myshopify.com/admin/api/2024-01/orders.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.TOKEN
        },
        body: JSON.stringify({
          order: {
            line_items: [
              { variant_id: Number(variant_id), quantity: Number(quantity) },
              { variant_id: Number(cod_fee_variant_id), quantity: 1 }
            ],
            customer: {
              first_name: name,
              phone: phone
            },
            shipping_address: {
              address1: address
            },
            financial_status: "pending",
            note: "Kapıda ödeme siparişi"
          }
        })
      }
    );

    const data = await response.json();
    console.log("Shopify cevap:", data);

    res.send("Sipariş alındı, teşekkürler");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hata oluştu");
  }
});

app.get("/", (req, res) => {
  res.send("Kapıda ödeme servis çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server çalışıyor:", PORT));
