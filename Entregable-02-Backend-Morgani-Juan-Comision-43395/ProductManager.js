const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      // Si ocurre un error al leer el archivo, asumimos que no existe y continuamos con un array vacío.
      this.products = [];
      this.saveProducts();
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, "utf-8");
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Error: Todos los campos son obligatorios");
      return;
    }

    // Validar que no se repita el campo "code"
    else if (this.products.some((p) => p.code === product.code)) {
      console.log("Error: El código del producto ya existe");
      return;
    }

    // Asignar un id autoincrementable
    const maxId = this.products.reduce(
      (max, p) => (p.id > max ? p.id : max),
      0
    );
    product.id = maxId + 1;

    // Agregar el producto al arreglo de productos
    this.products.push(product);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const product = this.products[productIndex];
      const updatedProduct = { ...product, ...updatedFields };
      this.products[productIndex] = updatedProduct;
      this.saveProducts();
    } else {
      console.log("Error: Producto no encontrado");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
    } else {
      console.log("Error: Producto no encontrado");
    }
  }
}

// Ejemplo de uso:
const manager = new ProductManager("productos.json");

// Agregar productos
manager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10.99,
  thumbnail: "ruta/imagen1.jpg",
  code: "ABC123",
  stock: 5,
});

manager.addProduct({
  title: "Producto 2",
  description: "Descripción del producto 2",
  price: 19.99,
  thumbnail: "ruta/imagen2.jpg",
  code: "DEF456",
  stock: 8,
});

// Obtener todos los productos
const products = manager.getProducts();
console.log(products);

// Obtener producto por id
const product1 = manager.getProductById(1); // Producto existente
console.log(product1);

const product2 = manager.getProductById(6); // Producto no existente

// Actualizar producto
manager.updateProduct(1, { price: 15.99 }); // Actualizar el precio del producto con id 1

// Eliminar producto
manager.deleteProduct(2); // Eliminar el producto con id 2
