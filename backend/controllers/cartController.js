import userModal from "../models/userModals.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        let userData = await userModal.findById(userId);
        let cartData = await userData.cartItems;

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModal.findByIdAndUpdate(userId, { cartItems: cartData });
        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//delete items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        let userData = await userModal.findById(userId);
        let cartData = await userData.cartItems;

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
        }

        await userModal.findByIdAndUpdate(userId, { cartItems: cartData });
        res.json({ success: true, message: "Removed From Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;

        let userData = await userModal.findById(userId);
        let cartData = await userData.cartItems;

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export {addToCart,removeFromCart,getCart}