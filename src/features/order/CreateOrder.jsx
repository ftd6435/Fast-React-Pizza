import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { clearCart, getCart, getCartTotalPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import "../../store";
import store from "../../store";
import { formatCurrency } from "../../utilities/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addresStatus,
    position,
    address,
  } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoadingAddress = addresStatus === "loading";
  const dispatch = useDispatch();

  // Get the feedback of the action function below
  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const normalPrice = useSelector(getCartTotalPrice);
  const priorityPrice = withPriority ? normalPrice * 0.2 : 0;
  const totalPrice = normalPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 md:px-0">
      <h2 className="my-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action={`/oder/new`} > */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            placeholder="Your Name..."
            defaultValue={username}
            type="text"
            name="customer"
            required
          />
          {formErrors?.customer && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formErrors.customer}
            </p>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input w-full"
              placeholder="Phone Number..."
              type="tel"
              name="phone"
              required
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow relative">
            <input
              disabled={isLoadingAddress}
              defaultValue={address}
              className="input w-full"
              type="text"
              name="address"
              placeholder="Your Address..."
              required
            />

            {formErrors?.address && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.address}
              </p>
            )}
            {!position.latitude && !position.longitude && <span className="absolute right-[3px] top-[1.5px] z-50 md:right-[5px] md:top-[3.5px]">
            <Button
              disabled={isSubmitting || isLoadingAddress}
              type="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
              }}
            >
              Get Position
            </Button>
          </span>}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-500 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ''} />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  // Catch the request
  const formData = await request.formData();
  // Get the data from formData by Object.fromEntries
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  let errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to reach you out :)";

  if (order.customer < 3)
    errors.customer = "Your name must be greater or equal to 3 characters :)";
  if (order.address === "")
    errors.address =
      "Please give us your address. We need it to deliver your order :)";

  if (Object.keys(errors).length > 0) return errors;

  // Create a brand new order
  const newOrder = await createOrder(order);

  // do NOT overuse this method
  store.dispatch(clearCart());

  // useNavigate hook is only used in component. Therefore, we use redirect function.
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
