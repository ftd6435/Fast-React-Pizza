import { formatCurrency } from "../../utilities/helpers";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { addItem, getPizzaQuantity } from "../cart/cartSlice";
import DeleteItem from "../cart/DeleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const countPizza = useSelector(getPizzaQuantity(id));
  const isAdded = countPizza > 0;

  const dispatch = useDispatch();

  function handleAddItem() {
    const newPizza = {
      pizzaId: id,
      name,
      unitPrice,
      quantity: 1,
      totalPrice: unitPrice * 1,
    };

    dispatch(addItem(newPizza));
  }

  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`${soldOut ? "opacity-70 grayscale" : ""} h-24`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(", ")}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-yellow-500">
              Sold out
            </p>
          )}
          {isAdded && <div className="flex items-center gap-3 sm:gap-8">
            <UpdateItemQuantity pizzaId={id} currentQauntity={countPizza} />
            <DeleteItem pizzaId={id} />
            </div>}

          {!soldOut && !isAdded && (
            <Button type="small" onClick={handleAddItem}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
