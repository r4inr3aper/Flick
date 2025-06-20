import promoModel from "../models/promoModel.js";

// Add promo code (admin)
const addPromo = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, validUntil } = req.body;
        
        const existingPromo = await promoModel.findOne({ code: code.toUpperCase() });
        if (existingPromo) {
            return res.json({ success: false, message: "Promo code already exists" });
        }

        const promo = new promoModel({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscount: maxDiscount || null,
            usageLimit: usageLimit || null,
            validUntil: new Date(validUntil)
        });

        await promo.save();
        res.json({ success: true, message: "Promo code added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding promo code" });
    }
};

// List all promo codes (admin)
const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find({});
        res.json({ success: true, data: promos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching promo codes" });
    }
};

// Validate and apply promo code (frontend)
const validatePromo = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        const promo = await promoModel.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        });

        if (!promo) {
            return res.json({ success: false, message: "Invalid or expired promo code" });
        }

        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return res.json({ success: false, message: "Promo code usage limit exceeded" });
        }

        if (orderAmount < promo.minOrderAmount) {
            return res.json({ 
                success: false, 
                message: `Minimum order amount of $${promo.minOrderAmount} required` 
            });
        }

        let discount = 0;
        if (promo.discountType === 'percentage') {
            discount = (orderAmount * promo.discountValue) / 100;
            if (promo.maxDiscount && discount > promo.maxDiscount) {
                discount = promo.maxDiscount;
            }
        } else {
            discount = promo.discountValue;
        }

        res.json({ 
            success: true, 
            discount: discount,
            promoCode: promo.code,
            description: promo.description
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error validating promo code" });
    }
};

// Apply promo code (when order is placed)
const applyPromo = async (req, res) => {
    try {
        const { code } = req.body;
        
        const promo = await promoModel.findOne({ code: code.toUpperCase() });
        if (promo) {
            promo.usedCount += 1;
            await promo.save();
        }
        
        res.json({ success: true, message: "Promo code applied" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error applying promo code" });
    }
};

// Delete promo code (admin)
const deletePromo = async (req, res) => {
    try {
        await promoModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Promo code deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting promo code" });
    }
};

// Toggle promo code status (admin)
const togglePromoStatus = async (req, res) => {
    try {
        const promo = await promoModel.findById(req.body.id);
        promo.isActive = !promo.isActive;
        await promo.save();
        res.json({ success: true, message: "Promo code status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating promo code status" });
    }
};

export { addPromo, listPromos, validatePromo, applyPromo, deletePromo, togglePromoStatus };
