const ApartmentBuilding = require('../../models/ApartmentBuilding');
const Apartment = require('../../models/Apartment');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

exports.getListApartment = function (req, res) {
    Apartment.find({building: req.params.buildingId})
        .exec(function (err, apartments) {
            if (err) {
                return res.json({
                    success: false,
                    errorCode: '121',
                    message: 'Lỗi không xác định'
                })
            }
            
            return res.json({
                success: true,
                errorCode: 0,
                data: apartments
            });
        });
};

exports.postAddNewApartment = (req, res, next) => {
    try {
        req.checkBody('apartmentName', 'Tên căn hộ không được để trống').notEmpty();
        req.checkBody('floor', 'Chọn tầng cho căn hộ').notEmpty();
        req.checkBody('manager', 'Chọn quản lý').notEmpty();
        
        req.getValidationResult().then(function (errors) {
            if (!errors.isEmpty()) {
                var errors = errors.mapped();

                return res.json({
                    success: false,
                    errors: errors,
                    data: req.body
                });
            } else {
                const apartment = new Apartment();
                apartment.apartmentName = req.body.apartmentName;
                apartment.building = req.body.buildingId;
                apartment.floor = req.body.floor;
                apartment.area = req.body.area;
                apartment.manager = req.body.manager;
                apartment.status = req.body.status;
                apartment.createdBy = req.session.user._id;

                apartment.save((err, a) => {
                    if (err) {
                        console.log('error create new abg', err);
                        return next(err);
                    }
                    /**
                     * Save to apartment building group
                     */
                    ApartmentBuilding.findById(req.body.buildingId, (err, ab) => {
                        if (ab) {
                            ab.apartments.pull(a._id);
                            ab.apartments.push(a._id);
                            ab.save((err, abResult) => {
                                req.flash('success', 'Thêm căn hộ thành công');
                                return res.json({
                                    success: true,
                                    errorCode: 0,
                                    message: 'Successfully'
                                })
                            });
                        }
                    })
                });
            }
        });
    } catch (e) {

    }
}