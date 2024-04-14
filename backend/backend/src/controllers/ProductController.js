const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, discount } = req.body;
        if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Yêu cầu điền hết thông tin!'
            });
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};


const updateProduct = async(req, res) =>{
    try{
         const productId = req.params.id
         const data = req.body
         if(!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần id của sản phẩm'
            })
         }
         const response = await ProductService.updateProduct(productId, data)
         return res.status(200).json(response)
    }catch(e){
     return res.status(404).json({
         message: e
     })
    } 
 }

 const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Cần id của product'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Yêu cầu id của sản phẩm'
            })
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Yêu cầu ids của sản phẩm'
            })
        }
        const response = await ProductService.deleteManyProduct(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getAllProduct = async (req, res) => {
    try {
        const {limit, page, sort, filter} = req.query;
        const response = await ProductService.getAllProduct(Number(limit) || null, Number(page), sort, filter);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType();
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}