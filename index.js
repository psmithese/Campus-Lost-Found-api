const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const MongoDBURL = "mongodb+srv://Smithese:Priscy123@cluster0.vggdodz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoose = require('mongoose');

const Item = require('./itemModel.js');
mongoose.connect(MongoDBURL).then(()=>{
    console.log("Connected to MongoDB");
    
})


app.post("/create-item", async(req,res)=>{
const {itemName, description, locationFound, dateFound,claimed} = req.body;
if(!itemName || !description || !locationFound ){
    return res.status(400).json({message: "Please fill all the fields"})    
}
const newItem = new Item({
    itemName, description, locationFound, dateFound,claimed})
    await newItem.save()
    res.status(201).json({message: "Item created successfully", newItem})   
})


app.get("/all-item", async(req,res)=>{
 const allItems = await Item.find()
 if(allItems.length === 0){
    return res.status(404).json({message: "No items found"})
 }
    res.status(200).json({message: "All items fetch successfully", allItems})
})

app.get("/one-item/:id", async(req,res)=>{
    const {id} = req.params
    const oneItem = await Item.findById(id)
    if(!oneItem){
        return res.status(404).json({message: "Item not found"})
    }
    res.status(200).json({message: "Item fetch successfully", oneItem})
})

app.put("/edit-item/:id", async(req,res)=>{
    const {id} = req.params
    const {itemName, description, locationFound, dateFound,claimed} = req.body;
    if(!itemName || !description || !locationFound ){
        return res.status(400).json({message: "Please fill all the fields"})    
    }
    const updatedItem = await Item.findByIdAndUpdate(id, {itemName, description, locationFound, dateFound,claimed}, {new: true})
    if(!updatedItem){
        return res.status(404).json({message: "Item not found"})
    }
    res.status(200).json({message: "Item edited successfully", updatedItem})
})

app.patch("/update-item/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const existingItem = await Item.findById(id);
        
        if (!existingItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }
        
        // Apply updates
        Object.keys(updates).forEach(key => {
            existingItem[key] = updates[key];
        });
        
        await existingItem.save();
        
        res.status(200).json({
            message: "Item updated successfully",
            existingItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating item",
            error: error.message
        });
    }
});


app.patch("/claim-item/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { claimed: true },
            { new: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }
        
        res.status(200).json({
            message: "Item marked as claimed",
            updatedItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Error claiming item",
            error: error.message
        });
    }
});

app.delete("/delete-item/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedItem = await Item.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }
        
        res.status(200).json({
            message: "Item deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting item",
            error: error.message
        });
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})  