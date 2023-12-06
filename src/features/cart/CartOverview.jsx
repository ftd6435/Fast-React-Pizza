import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCartTotalPrice, getCartTotalQuantity } from "./cartSlice";

function CartOverview() {
  const cartTotalPrice = useSelector(getCartTotalPrice);
  const cartTotalQuantity = useSelector(getCartTotalQuantity);

  if(!cartTotalQuantity) return;

  return (
    <div className="px-4 sm:px-6 py-4 bg-stone-800 text-stone-200 uppercase flex items-center justify-between">
      <p className="font-semibold text-stone-300 md:text-base space-x-4 sm:space-x-6">
        <span>{cartTotalQuantity} pizzas</span>
        <span>${cartTotalPrice}</span>
      </p>
      <Link to='/cart'>Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
