const express = require('express');
const router = express.Router();
const FoodItem = require('./../modules/foodItem');

//route to add a item

router.post('/', async(req, res) => {
    try {
        const { name, description, quantity, expiryDate } = req.body;
        const newFoodItem = new FoodItem({
            name,
            description,
            quantity,
            expiryDate,

        });
        const saveFoodItem = await newFoodItem.save();
        res.status(201).json(saveFoodItem);
    } catch (err) {
        console.error('Error creating food Item: ', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//get all food item
router.get('/', async(req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.json(foodItems);
    } catch (err) {
        console.error('Error fetching food Item: ', err);
        res.status(500).json({ error: 'Server error' });
    }
});


//route method to update the food item

router.put('/:id', async(req, res) => {
    try {
        const { name, description, quantity, expiryDate, category } = req.body;
        const updatedFoodItem = await FoodItem.findByIdAndUpdate(req.params.id, { name, description, quantity, expiryDate }, { new: true });
        if (!updatedFoodItem) {
            res.status(404).json({ error: 'Food Item not found' });
        }
        res.json(updatedFoodItem);
    } catch (err) {
        console.error('Error in updating food Item: ', err);
        res.status(500).json({ error: 'Server error' });
    }
});

//delete a food item by id
router.delete('/:id', async(req, res) => {
    try {

        const deleteFoodItem = await FoodItem.findByIdAndDelete(req.params.id);
        if (!deleteFoodItem) {
            return res.status(404).json({ error: 'Food Item not found' });
        }
        res.json({ message: 'Food Item deleted successfully' });
    } catch (err) {
        console.error('Error in deleting  food Item: ', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;