// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port     = process.env.PORT || 9000;
var config   = require('./config.js');
var fs       = require('fs');

app.use(bodyParser());

// mongoose.connect(config.db);

app.all('*',function(req, res, next) {
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
    //next();
});

// set up our express application
app.use(express.static(__dirname));


var products = JSON.parse(fs.readFileSync('./sample-products.json').toString());
app.get('/allProducts', function(req,res) {
    if(products)
        res.json({success:true,message:"this is the list of all products", products:products})
    else
        res.json({success:false,message:"unable to get products"});
})

app.get('/product/:id', function(req,res) {
    var id = req.params.id;
    console.log("product id is,",id);

    for(var i=0;i<products.length;i++){
        if(products[i].id.toString()==id){
            var product = products[i];
            break
        }
    }

    if(product)
        res.json({success:true,message:"this is the details of product", product:product})
    else
        res.json({success:false,message:"unable to get product"});

})

var cart = {};
/*format of cart would be->
{
    productId:{
        .
        .
        .
        variants:{
            variantId:{
                .
                .
                .
                count:
            }
        }
    }
}
*/
app.post('/addToCart', function(req,res) {

    var productId = req.body.productId;
    var variantId = req.body.variantId;

    console.log("adding product->",productId,"with variant->",variantId," to cart");

    for(var i=0;i<products.length;i++){
        if(products[i].id.toString()==productId){
            // console.log("products[i].variants",products[i].variants,"lemghth->",products[i].variants.length)
            for(var j=0;j<products[i].variants.length;j++){
                if(products[i].variants[j].id.toString()==variantId){
                    console.log("product with variant found");
                    var selectedProduct = JSON.parse(JSON.stringify(products[i]));    
                    var selectedVariant = selectedProduct.variants[j];
                    selectedProduct['variants'] = null;
                    break;
                }
            }            
        }
    }

    console.log("adding product to cart");
    if(selectedProduct){
        if(!cart.hasOwnProperty(productId)){
            console.log("product was not added to cart before");
            cart[productId]=selectedProduct;
            selectedVariant.count=1;
            cart[productId].variants={};
            cart[productId].variants[variantId]=selectedVariant;
        }
        else{
            console.log("product was added to cart before");
            if(!cart[productId].variants.hasOwnProperty(variantId)){
                console.log("product variant was not added to cart before");
                selectedVariant.count=1;
                cart[productId].variants[variantId]=selectedVariant;
            }
            else{
                console.log("product variant was added to cart before");
                cart[productId].variants[variantId].count++;
            }
        }

        res.json({success:true,message:"product added to cart!"});
        // console.log("current cart->",cart);        
    }
    else{
        res.json({success:false,message:"unable to get product in catalague"});
    }

})

app.get('/cart', function(req,res) {
    res.json({success:true,message:"got the cart",cart:cart});

})

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);