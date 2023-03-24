import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import React, { useEffect, useState } from "react";
// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({ id, name, availableCount, price, handleTotalSummary }) => {
  const [quantity, setQuantity] = useState(0);
  const [count, setCount] = useState(availableCount);
  const [productTotal, setProductTotal] = useState(0);
  const handleIncrement = () => {
    setQuantity((oldState) => oldState + 1);
  };
  const handleDecrement = () => {
    setQuantity((oldState) => oldState - 1);
  };
  useEffect(() => {
    setCount(availableCount - quantity);
    setProductTotal(price * quantity);
    handleTotalSummary(productTotal);
  }, [quantity, productTotal]);
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{count}</td>
      <td>{price}</td>
      <td>{quantity}</td>
      <td>{productTotal}</td>
      <td>
        <button disabled={count < 1} onClick={handleIncrement}>
          +
        </button>
        <button disabled={quantity < 1} onClick={handleDecrement}>
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSummary, setTotalSummary] = useState(0);

  const handleTotalSummary = async (amount) => {
    setTotalSummary((prevTotal) => prevTotal + amount);
  };
  useEffect(() => {
    const fetchProducts = () => {
      getProducts()
        .then((prods) => {
          console.log(prods);
          setProducts(prods);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      {loading && <LoadingIcon />}
      {products && products.length > 0 && (
        <main>
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th># Available</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <Product
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      availableCount={product.availableCount}
                      price={product.price}
                      handleTotalSummary={handleTotalSummary}
                    />
                  );
                })}
              </tbody>
            </table>
            <h2>Order summary</h2>
            <p>Discount: $ </p>
            <p>Total: $ {totalSummary}</p>
          </div>
        </main>
      )}
    </div>
  );
};

export default Checkout;
