import fs from 'fs';

const sourceSegments = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

const fixes = {
  "11": "Địa chỉ: Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
  "12": "Khoa: Khoa Khám bệnh - Cấp cứu",
  "17": "YÊU CẦU",
  "29": "KẾT LUẬN:",
  "31": "BÁC SĨ CHỈ ĐỊNH",
  "37": "Đ/c: 216 Nguyễn Công Trứ, Đà Nẵng",
  "42": "Ngày 23 tháng 5 năm 2025 BÁC SĨ THỰC HIỆN",
  "43": "ThS.BS.",
  "46": "□ Cấp cứu",
  "51": "Đối tượng: Người nước ngoài",
  "53": "Địa chỉ: Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
  "54": "Khoa chỉ định: Khoa Khám bệnh - Cấp cứu - Phòng Khám Chất Lượng Cao",
  "59": "Đ/c: 216 Nguyễn Công Trứ, Đà Nẵng",
  "62": "□ Cấp cứu",
  "68": "Số thẻ BHYT:",
  "69": "Địa chỉ: Phường Phước Mỹ, Quận Sơn Trà, Đà Nẵng",
  "70": "Khoa chỉ định: Khoa Khám bệnh - Cấp cứu - Phòng Khám Chất Lượng Cao",
  "72": "Chẩn đoán : Khám sức khỏe tổng quát;",
  "76": "Nhĩ trái mm",
  "80": "Thành sau thất trái (mm)"
};

const translations = {};

for (const [id, data] of Object.entries(sourceSegments)) {
  let text = data.sourceText;
  if (fixes[id]) {
    text = fixes[id];
  }
  translations[id] = text;
}

fs.writeFileSync('data/translations.json', JSON.stringify(translations, null, 2), 'utf8');
console.log(`Generated data/translations.json for ${Object.keys(translations).length} segments.`);
