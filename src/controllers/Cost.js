const CostType = require('../models/CostType');
const Cost = require('../models/Cost');
const Abg = require('../models/ApartmentBuildingGroup');
const ApartmentBuilding = require('../models/ApartmentBuilding');
const Apartment = require('../models/Apartment');

// Get all Categories
exports.getIndex = function (req, res) {
	CostType.find({}).populate({
		path: 'createdBy',
		model: 'User'
	}).exec(function (err, costTypes) {
		if (err) {
			console.log('err', err)
			return done(err);
		}
		Abg.find({
			
		}, (err, abgs) => {
			res.render('cost/index', {
				title: 'Chi phí',
				current: ['cost', null],
				costTypes: costTypes,
				abgs: abgs
			});
		})
	});
};

exports.getCreate = function (req, res) {
	res.render('cost-type/create', {
		title: 'Thêm loại chi phí',
		current: ['cost', 'cost type']
	});
};

exports.postCreate = function (req, res) {
	/*
	* Validate create cost type
	*/ 
  req.checkBody('name', 'Tên chi phí không được để trống').notEmpty();

	var errors = req.getValidationResult().then(function(errors) {
		if (!errors.isEmpty()) {
			var errors = errors.mapped();
			return res.render('cost-type/create', {
				title: 'Thêm chi phí',
				current: ['cost', null],
				errors: errors,
				data: req.body,
			});;
		}

		/*
		* End validate
		*/
		var costType = new CostType();
	
		costType.name = req.body.name;
		costType.status = req.body.status;
		costType.createdBy = req.session.user._id;
		// save the user
		costType.save(function (err) {
			console.log('costype', err);
			if (err) {
				console.log('Error in Saving: ' + err);
				return res.send({ "result": false });
			}
			return res.redirect('/cost-type');
		});
	});
};

exports.getImportTemplate = (req, res, next) => {
	console.log('req.query', req.query);
	let buildingId = req.query.buildingId;
	let costTypeId = req.query.costTypeId;
	let month = req.query.month;
	let year = req.query.year;

	if (!buildingId || !costTypeId || !month || !year) {
		return res.json({
			success: false,
			errorCode: '432'
		});
	}

	const XLSX = require('xlsx'), path = require('path');
	let costData = [], costWs, costTypeData = [], costTypeWs, apartmentData = [], apartmentWs, filePath;

	costData = [
		['loai_chi_phi', 'can_ho', 'toa_nha', 'chung_cu', 'so_tien', 'thang', 'nam']
	];
	costTypeData = [
		['id', 'ten_chi_phi']
	];
	apartmentData = [
		['id', 'ten_can_ho']
	];

	/**
	 * Query data building
	 */
	ApartmentBuilding.findById(buildingId)
	.populate({
		path: 'apartmentBuildingGroup',
		model: 'ApartmentBuildingGroup'
	})
	.populate({
		path: 'apartments',
		model: 'Apartment'
	})
	.exec((err, building) => {
		CostType.findById(costTypeId)
		.exec((err, costType) => {
			/**
			 * Append data to worksheet
			 */
			if (costType) {
				costTypeData.push([
					costType._id,
					costType.name
				]);
				for (let i=0; i<building.apartments.length; i++) {
					costData.push(
						[
							costType.name,
							building.apartments[i].apartmentName,
							building.buildingName,
							building.apartmentBuildingGroup.abgName,
							'',
							month,
							year
						]
					)
					apartmentData.push([
						building.apartments[i]._id,
						building.apartments[i].apartmentName
					])
				}
			}

			costWs = XLSX.utils.aoa_to_sheet(costData);
			costTypeWs = XLSX.utils.aoa_to_sheet(costTypeData);
			apartmentWs = XLSX.utils.aoa_to_sheet(apartmentData);

			wb = XLSX.utils.book_new();
			filePath = path.join(__dirname, '/../..' + '/media/files/import-template/chi-phi-dich-vu.xlsx');

			XLSX.utils.book_append_sheet(wb, costWs, "Tiền phí");
			XLSX.utils.book_append_sheet(wb, costTypeWs, "Loại chi phí");
			XLSX.utils.book_append_sheet(wb, apartmentWs, "Căn hộ");
			XLSX.writeFile(wb, filePath);

			return res.json({
				success: true,
				errorCode: 0,
				fileUrl: process.env.MEDIA_URL + '/files/import-template/chi-phi-dich-vu.xlsx'
			});
		})
	})
}
