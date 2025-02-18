// Fungsi untuk menggulir ke formulir pemesanan
function scrollToOrderForm() {
  document.getElementById('orderFormSection').scrollIntoView({ behavior: 'smooth' });
}

// Data harga produk
const productPrices = {
  "Gula Aren Bubuk": 25000,
  "Kripik Pisang Karamel": 7000,
  "Pia Merah": 20000,
};

// Tambah baris produk
document.getElementById('addProduct').addEventListener('click', addProductRow);

function addProductRow() {
  const newRow = document.createElement('div');
  newRow.className = 'product-row';
  newRow.innerHTML = `
      <select class="product-select">
          <option value="">Pilih Produk</option>
          <option value="Gula Aren Bubuk">Gula Aren Bubuk (Rp25,000)</option>
          <option value="Kripik Pisang Karamel">Kripik Pisang Karamel (Rp7,000)</option>
          <option value="Pia Merah">Pia Merah (Rp20,000)</option>
      </select>
      <input type="number" class="quantity" min="1" placeholder="Jumlah">
  `;
  document.getElementById('productRows').appendChild(newRow);

  // Tambah event listener untuk update total
  newRow.querySelector('.product-select').addEventListener('change', calculateTotal);
  newRow.querySelector('.quantity').addEventListener('input', calculateTotal);
}

// Hitung total
function calculateTotal() {
  let grandTotal = 0;
  document.querySelectorAll('.product-row').forEach(row => {
    const product = row.querySelector('.product-select').value;
    const quantity = parseInt(row.querySelector('.quantity').value) || 0;
    if (product && quantity > 0) {
      grandTotal += productPrices[product] * quantity;
    }
  });
  document.getElementById('grandTotal').textContent = `Rp${grandTotal.toLocaleString()}`;
}

// Submit pesanan
function submitOrder() {
  const customerName = document.getElementById('customerName').value.trim();
  const orderDate = new Date().toLocaleDateString();
  const orderItems = [];

  // Kumpulkan data pesanan
  document.querySelectorAll('.product-row').forEach(row => {
    const product = row.querySelector('.product-select').value;
    const quantity = parseInt(row.querySelector('.quantity').value);
    if (product && quantity > 0) {
      orderItems.push({
        product,
        quantity,
        subtotal: productPrices[product] * quantity,
      });
    }
  });

  // Validasi
  if (!customerName || orderItems.length === 0) {
    alert('Harap isi nama pembeli dan minimal 1 produk!');
    return;
  }

  // Format pesan WhatsApp
  let message = `Halo, saya ingin memesan:\n\nNama: ${customerName}\n`;
  orderItems.forEach((item, index) => {
    message += `\n${index + 1}. ${item.product}\n`
             + `   Jumlah: ${item.quantity} pack\n`
             + `   Subtotal: Rp${item.subtotal.toLocaleString()}\n`;
  });
  message += `\nTotal Harga: Rp${document.getElementById('grandTotal').textContent.split('Rp')[1]}\n`
           + `Tanggal Pemesanan: ${orderDate}\n\nTerima kasih!`;

  // Copy pesan ke clipboard
  navigator.clipboard.writeText(message).then(() => {
    alert('Pesan telah disalin ke clipboard. Silakan paste di WhatsApp.');
  }).catch(err => {
    console.error('Gagal menyalin pesan: ', err);
    alert('Gagal menyalin pesan. Silakan coba lagi.');
  });

  // Buka WhatsApp dengan pesan yang diformat
  const whatsappUrl = `https://wa.me/6282282230423?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}