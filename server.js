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
    name,
    phone,
    address,
    note
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
              {
                variant_id: Number(variant_id),
                quantity: Number(quantity)
              },
              {
                title: "Kapıda Ödeme Hizmet Bedeli",
                quantity: 1,
                price: "50.00"
              }
            ],
            shipping_address: {
              name: name,
              phone: phone,
              address1: address
            },
            financial_status: "pending",
            note: `Kapıda ödeme siparişi\nTelefon: ${phone}\nNot: ${note || "-"}`
          }
        })
      }
    );

    const data = await response.json();
    console.log("Shopify cevap:", data);

    if (data.errors) {
      return res.status(400).json(data);
    }

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
