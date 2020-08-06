function precise(x , precision) {
  return parseFloat(Number.parseFloat(x).toPrecision(precision));
}
function fixed(x, fixed){
  return parseFloat(Number.parseFloat(x).toFixed(fixed));
}

function poundsToKilograms(pounds){
  return Math.round(pounds/2.20462);
}

function kilogramToPounds(kg){
  return Math.round(kg*2.20462);
}

function centimeterToInches(cm){
  return Math.round(cm/2.54);
}

function inchesToCentimeter(inches){
  return Math.round(inches*2.54);
}

function determineKeFromEquation(equation, crcl, vd){
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

function determineKe(crcl, vd){
  return precise(crcl/vd,2);
}

function determineVd(vd, totalbodyweight){
  return Math.round(vd * totalbodyweight);
}

function determineLoadingDose(indication, totalbodyweight){
  let loadingDose = -1;
  //severe 25 mg/kg
  if (indication == "severe infection"){
    loadingDose = 25 * totalbodyweight;
  //nonsevere 20 mg/kg
  }else if (indication == "non-limb threatening SSTI" || indication == "urinary tract infection"){
    loadingDose = 20 * totalbodyweight;
  }else{
    return -1;
  }
  //max 3g
  if (loadingDose > 3000){
    loadingDose = 3000;
  }
  var round = function (num, precision = 250) {
	   num = parseFloat(num);
	    if (!precision) return num;
        return (Math.round(num / precision) * precision);
  }
  let roundedLoadingDose = round(loadingDose);
  return roundedLoadingDose;
}

function determineDosingInterval(indication, crcl){
  if (indication == "severe infection"){
    if (crcl > 120){
      return 8;
    }else if (crcl >= 70 && crcl <= 120){
      return 12;
    }else if (crcl >= 60 && crcl <= 69){
      return 18;
    }else if (crcl >= 45 && crcl <= 59){
      return 24;
    }else if (crcl >= 30 && crcl <= 44){
      return 36;
    }else if (crcl < 30){
      return 24;
    }
  }else if (indication == "non-limb threatening SSTI"){
    if (crcl > 70){
      return 12;
    }else if (crcl >= 60 && crcl <= 69){
      return 18;
    }else if (crcl >= 45 && crcl <= 59){
      return 24;
    }else if (crcl >= 30 && crcl <= 44){
      return 36;
    }else if (crcl < 30){
      return 24;
    }
  }else if (indication == "urinary tract infection"){
    if (crcl > 70){
      return 12;
    }else if (crcl >= 60 && crcl <= 69){
      return 24;
    }else if (crcl >= 45 && crcl <= 59){
      return 36;
    }else if (crcl >= 30 && crcl <= 44){
      return 48;
    }else if (crcl < 30){
      return 24;
    }
  }
}

function determineBodyWeightForCrCl(gender, height, totalbodyweight){
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
    return [crclweight,"TBW"];
  }
  if (totalBodyWeight > 1.25 * idealBodyWeight){
    crclweight = adjustedBodyWeight
    console.log("adjbw used");
    return [crclweight, "AdjBW"];
  }

  crclweight = idealBodyWeight;
  console.log("ibw used");
  return [crclweight,"IBW"];
}


function creatineClearance(gender, age, bodyweight, serumcreatine){
  let result = ((140 - age) * bodyweight)/((72)*(serumcreatine));
  if (gender == "female"){
    result *= 0.85;
  }
  return precise(result,2);
}



function vancoClearance(crcl){
  return crcl * 0.7 * 0.006;
}

function determineInitialMaintenanceDose(totalbodyweight){
  let maintenanceDose = -1;
  maintenanceDose = 15 * totalbodyweight;
  if (maintenanceDose > 2000){
    maintenanceDose = 2000;
  }
  return maintenanceDose;
}

function estimateAUC24(maintenancedose, dosinginterval, vancoclearance){
  let totalDailyDose = maintenancedose * 24/dosinginterval;
  return totalDailyDose/vancoclearance;
}

function maintenanceDose(ke, vd, dosinginterval, desiredAUC = 500){
  let clvan = ke * vd;
  let totalDailyDose = clvan * desiredAUC;
  let unroundedMaintenanceDose = totalDailyDose/(24/dosinginterval);
  if (unroundedMaintenanceDose > 2000){
    unroundedMaintenanceDose = 2000;
    console.log("over 2000");
    return unroundedMaintenanceDose;
  }
  var round = function (num, precision = 250) {
	  num = parseFloat(num);
	  if (!precision) return num;
    return (Math.round(num / precision) * precision);
  }
  let maintenanceDose = round(unroundedMaintenanceDose);
  return maintenanceDose;
};

function ssKe(CmaxMeasured, CminMeasured, dosinginterval, tCmin, tCmax){
  return precise(Math.log(CmaxMeasured/CminMeasured)/(dosinginterval - (tCmin+tCmax)),2);
}
function ssTHalfLife(ke){
  return precise(0.693/ke, 2);
}
function actualCmax(CmaxMeasured, ke, tCmax){
  return fixed(CmaxMeasured/(Math.E**(-ke * tCmax)),1);
}
function actualCmin(CminMeasured, ke, t2){
  return fixed(CminMeasured*(Math.E**(-ke * t2)),1);
}
function linTrap(CmaxActual, CminActual, infusiontime){
  return (CmaxActual + CminActual) * infusiontime/2;
}
function logTrap(CmaxActual, CminActual, ke){
  return (CmaxActual - CminActual)/ke;
}
function auc0toT(linTrap, logTrap){
  return (linTrap + logTrap);
}
function auc24(auc0toT, dosinginterval){
  return fixed((auc0toT * (24/dosinginterval)),1);
}

function getHours(moment){
  let years = moment.years;
  let months = moment.months;
  let hours = moment.hours;
  let minutes = moment.minutes;
  let seconds = moment.seconds;
  let totalHours = years*8760 + months*730 + hours + minutes/60 + seconds/60/60;
  return totalHours;
}

function ssVd(dose, infusiontime, ke, Cmax, Cmin){
  return fixed(((dose/infusiontime) * (1 - Math.E**(-ke*infusiontime)))/(ke*(Cmax-(Cmin*(Math.E**(-ke*infusiontime))))),1);
}

function newDosingInterval(infusiontime, ke, CmaxDesired = 30, CminDesired = 15){
  let newInterval = Math.log(CmaxDesired/CminDesired)/ke + infusiontime;
  if(newInterval < 8 || newInterval < 10){
    newInterval = 8;
  }else if(newInterval < 14){
    newInterval = 12;
  }else if (newInterval < 20){
    newInterval = 18;
  }else if (newInterval < 30){
    newInterval = 24;
  }else if (newInterval < 52){
    newInterval = 48;
  }else{
    console.log("invalid dosingInterval");
  }
  return newInterval;
}
