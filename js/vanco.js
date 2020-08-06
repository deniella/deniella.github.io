let gender = ["male", "female"];
let age = -1;
let height = -1;
let serumCreatine = -1;
let volumeOfDistribution = -1;
let tBW = -1;
let iBW = -1;
let adjBW = -1;
let ke = -1;



let vdPopulation = ["normal" , "obesity", "dehydrated", "overhydrated" , "cystic fibrosis", "septic shock", "ICU", "trauma", "ESRD"]
let keEquation = ["ducharme" , "matzke" , "PK"];

function checkAge(age){
  if(age > 18){
    return true;
  }else{
    return false;
  }
}
function loadingDoseTrough(totalbodyweight) {
  return 25 * totalbodyweight; // 25 mg/kg * totalbodyweight
}
function maintenanceDoseTrough(totalbodyweight) {
  return 15 * totalbodyweight;
}

function determineBodyWeight(gender, height, totalbodyweight){
  let totalBodyWeight = totalbodyweight;
  console.log("tbw " + totalBodyWeight);
  let idealBodyWeight = -1;
  let inchesOver60 = height;
  if (inchesOver60 > 60){
    inchesOver60 -= 60;
  }else if (inchesOver60 <= 60 && inchesOver60 > 0){
    inchesOver60 = 0;
  }else{
    console.log("invalid height");
  }
    console.log("inches over 60 " + inchesOver60);
  if (gender == "male"){
    idealBodyWeight =  50 + 2.3 * inchesOver60;
  }else if (gender == "female"){
    idealBodyWeight = 45.5 + 2.3 * inchesOver60;
  }else{
    console.log("invalid gender");
  }
  console.log("ibw " + idealBodyWeight);
  
  let adjustedBodyWeight = idealBodyWeight - 0.4 * (totalBodyWeight - idealBodyWeight);
  console.log("adjbw " + adjustedBodyWeight);
  
  let crclweight = -1;
  
  if (totalBodyWeight < idealBodyWeight){
    crclweight = totalBodyWeight;
    console.log("tbw used");
    return crclweight;
  }
  if (totalBodyWeight > 1.25 * idealBodyWeight){
    crclweight = adjustedBodyWeight
    console.log("adjbw used");
    return crclweight;
  }
  
  crclweight = idealBodyWeight;
  console.log("ibw used");
  return crclweight;
}

let bodyweight = determineBodyWeight("male", 66, 100);

function creatineClearance(gender, age, bodyweight, serumcreatine){
  let result = ((140 - age) * bodyweight)/((72)*(serumcreatine));
  if (gender == "female"){
    result *= 0.85;
  }
  return result;
}

let crcl = creatineClearance("male", 50, bodyweight, 1.2)

console.log("crcl " + crcl);

function determineVdAH(age, totalbodyweight){
  if(age <= 65){
    return 0.7 * totalbodyweight;
  }else{
    return 0.76 * totalbodyweight;
  }
}

function determineVd(population, totalbodyweight){
  if(population == "normal"){
    return 0.65 * totalbodyweight;
  }else if (population == "obesity"){
    return 0.5 * totalbodyweight;
  }else if (population == "dehydrated"){
    return 0.55 * totalbodyweight;
  }else if (population == "overhydrated"){
    return 0.75 * totalbodyweight;
  }else if (population == "cystic fibrosis"){
    return 0.75 * totalbodyweight;
  }else if (population == "septic shock" || population == "ICU" || population == "trauma" || population == "ESRD"){
    return 0.7 * totalbodyweight;
  }
}

let vd = determineVd("normal", bodyweight);

console.log("vd " + vd);

function determineKe(equation, crcl, vd = null){
  switch(equation){
    case "ducharme":
      return 0.0016 * crcl;
      break;
    case "matzke":
      return 0.00083 * crcl + 0.0044;
      break;
    case "PK":
      return crcl/vd;
      break;
  }
}

let ke = determineKe("matzke", crcl);

l

function tHalfLife(ke){
  return 0.693/ke;
}

function dosingInterval(crcl, ke, infusiontime = 1){
  let desiredcmax = -1;
  let desiredcmin = -1;
  if(crcl > 30){
    desiredcmax = 40;
  }else if (crcl <= 30 && crcl > 0){
    desiredcmin = 15;
  }else{
    console.log("invalid crcl");
  }
  let tau = Math.ln((desiredcmax/desiredcmin))/ke + infusiontime;
  let dosingInterval = tau;
  if(dosingInterval < 8 || dosingInterval < 10){
    dosingInterval = 8;
  }else if(dosingInterval < 14){
    dosingInterval = 12;
  }else if (dosingInterval < 20){
    dosingInterval = 18;
  }else if (dosingInterval < 30){
    dosingInterval = 24;
  }else if (dosingInterval < 52){
    dosingInterval = 48;
  }else{
    console.log("invalid dosingInterval");
  }
  return dosingInterval;
    
}

function loadingDose(crcl, totalbodyweight){
  let unroundedLoadingDose = -1;
  if (crcl > 30){
    unroudedLoadingDose = 25 * totalbodyweight;
  }else{
    unroudedLoadingDose = 20 * totalbodyweight;
  }
  let loadingDose = unroundedLoadingDose;
  
  if(loadingDose < 1125){
    loadingDose = 1000;
  }else if(loadingDose < 1375){
    loadingDose = 1250;
  }else if(loadingDose < 1625){
    loadingDose = 1500;
  }else if(loadingDose < 1875){
    loadingDose = 1750;
  }else if(loadingDose < 2125){
    loadingDose = 2000;
  }else if(loadingDose < 2375){
    loadingDose = 2225;
  }else if(loadingDose <= 2500 || loadingDose > 2500){
    loadingDose = 2500;
  }
  return loadingDose;
}

function maintenanceDose(desiredAUC = 500, ke, vd, dosinginterval){
  let vancoClearance = ke * vd;
  let totalDailyDose = vancoClearance * desiredAUC;
  let unroundedMaintenanceDose = totalDailyDose/24/dosinginterval;
  var round = function (num, precision = 250) {
	num = parseFloat(num);
	if (!precision) return num;
  return (Math.round(num / precision) * precision);
  }
  let maintenanceDose = round(unroundedMaintenanceDose);
  return maintenanceDose;
};
  
function predictedCmax(dose, vd, ke, dosinginterval, infusiontime){
  return (dose/vd)/(1-Math.exp(ke * -1 * ( dosinginterval)));
}

function predictedCmin(cmax, ke, dosinginterval, infusiontime){
  return cmax * (Math.exp(ke * -1 * ( dosinginterval - infusiontime)));
}

function predictedAUC24(cmax, cmin, ke, dosinginterval, infusiontime){
  let infusionAUC = (cmax + cmin)/2 + infusiontime;
  let eliminationAUC = (cmax - cmin)/ke;
  return (infusionAuc + eliminationAUC) * (24/dosinginterval);
}