// LatinHonors.js
// check units and GWA and assign titles
const { Student } = require("../../../config/models");
const summa_cum_laude = { grade: 1.2, title: "Summa Cum Laude" };
const magna_cum_laude = { grade: 1.45, title: "Magna Cum Laude" };
const cum_laude = { grade: 1.75, title: "Cum Laude" };

exports.verifyLatinHonor = async (record, student_id) => {
  const student_gwa = record.gwa;
  if (student_gwa <= summa_cum_laude.grade) {
    // 1.2 and above - SUMMA CUM LAUDE
    await setLatinHonor(student_id, summa_cum_laude.title);
  } else if (student_gwa <= magna_cum_laude.grade) {
    // 1.74 t0 1.45 - MAGNA CUM LAUDE
    await setLatinHonor(student_id, magna_cum_laude.title);
  } else if (student_gwa <= cum_laude.grade) {
    // 1.75 - CUM LAUDE
    await setLatinHonor(student_id, cum_laude.title);
  }
};

setLatinHonor = async (student_id, honor_title) => {
  //set latin honors in database
  await Student.query()
    .where({ student_id })
    .update({ latin_honor: honor_title })
    .then();
};
