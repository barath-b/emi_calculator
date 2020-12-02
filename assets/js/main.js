var amtf = document.getElementById("amt-f");
var amtbg = document.getElementById("amt-bg");
var amts = document.getElementById("amt-s");
var yrsf = document.getElementById("yrs-f");
var yrsbg = document.getElementById("yrs-bg");
var yrss = document.getElementById("yrs-s");
var irf = document.getElementById("ir-f");
var irbg = document.getElementById("ir-bg");
var irs = document.getElementById("ir-s");
var month = document.getElementById("month");
var monthBtn = document.getElementById("monthBtn");
var error = document.querySelector(".error");
var principal, i, yrs, emi, balPayment, dMonths, balPriciplal, dInt,
    dStart = [],
    dEnd = [],
    monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
principal = amtf.value;
i = irf.value;
yrs = yrsf.value;

function format(x) {
    return new Intl.NumberFormat('en-IN').format(x);
}
amtbg.style.width = ((((amtf.value - 100000) / 50000) / 1998) * 100).toFixed(2) + "%";
amtf.value = format(amtf.value);

amtf.addEventListener("change", function () {
    if (amtf.value > 100000000) {
        amtf.value = 100000000;
    } else if (amtf.value < 100000) {
        amtf.value = 100000;
    }
    amts.value = this.value;
    principal = this.value;
    amtbg.style.width = ((((this.value - 100000) / 50000) / 1998) * 100).toFixed(2) + "%";
    amtf.value = format(this.value);
    calc();
});

amts.addEventListener("input", function () {
    amtf.value = this.value;
    principal = this.value;
    amtbg.style.width = ((((this.value - 100000) / 50000) / 1998) * 100).toFixed(2) + "%";
    amtf.value = format(this.value);
    calc();
});

yrsf.addEventListener("change", function () {
    if (yrsf.value > 30) {
        yrsf.value = 30;
    } else if (yrsf.value < 1) {
        yrsf.value = 1;
    }
    if (yrsf.value % 1 != 0) {
        yrsf.value = Math.floor(yrsf.value);
    }
    yrs = this.value;
    yrsbg.style.width = (((this.value - 1) / 29) * 100).toFixed(2) + "%";
    yrss.value = this.value;
    calc();
});
yrss.addEventListener("input", function () {
    yrs = this.value;
    yrsf.value = this.value;
    yrsbg.style.width = (((this.value - 1) / 29) * 100).toFixed(2) + "%";
    calc();
});
irf.addEventListener("change", function () {
    if (irf.value > 20) {
        irf.value = 20;
    } else if (irf.value < 5) {
        irf.value = 5;
    }
    i = this.value;
    irs.value = this.value;
    irbg.style.width = ((((this.value - 5) / 0.01) / 1501) * 100).toFixed(2) + "%";
    calc();
});
irs.addEventListener("input", function () {
    i = this.value;
    irf.value = this.value;
    irbg.style.width = ((((this.value - 5) / 0.01) / 1501) * 100).toFixed(2) + "%";
    calc();
})

function calc() {
    var roi = i / (12 * 100);
    var months = yrs * 12;
    emi = principal * ((roi * Math.pow((1 + roi), months)) / (Math.pow((1 + roi), months) - 1));
    var tot_int = emi * months;
    var int = tot_int - principal;
    balPriciplal = principal;
    balPayment = tot_int;
    document.getElementById("prin").innerHTML = "₹ " + format(Math.round(principal));
    document.getElementById("emi").innerHTML = "₹ " + format(Math.round(emi));
    document.getElementById("int").innerHTML = "₹ " + format(Math.round(int));
    document.getElementById("tot").innerHTML = "₹ " + format(Math.round(tot_int));
}
calc();

monthBtn.addEventListener("click", function () {
    calc();
    getMonths();
});

function getMonths() {
    if (Number(month.value.slice(0, 4)) / 1000 > 1.98) {
        error.innerHTML = "";
        dStart[0] = Number(month.value.slice(5, 7));
        dStart[1] = Number(month.value.slice(0, 4));
        dEnd[0] = dStart[0];
        dEnd[1] = +dStart[1] + +yrs;
        clear();
        bulid();
    } else {
        month.value = "2019-07";
        error.innerHTML = "Enter a valid date";
    }
}

function bulid() {
    let parent = document.querySelector(".list");
    let y, yearStats = [0, 0, 0, 0, 0, 0];
    if (dStart[0] != 1) {
        y = +yrs + 1;
    } else {
        y = yrs;
    }
    for (let i = 0; i < y; i++) {
        yearStats[0] = 0;
        yearStats[1] = 0;
        yearStats[2] = 0;
        let div = createDiv(["oneyear"]);
        parent.appendChild(div);
        div = createDiv(["year", "flex"]);
        parent.lastElementChild.appendChild(div);
        let year = parent.lastElementChild.firstElementChild;
        let divp = createDivP();
        divp.firstElementChild.innerHTML = +dStart[1] + i;
        div = createDiv(["expand"]);
        div.innerHTML = "+";
        divp.insertBefore(div, divp.firstElementChild);
        year.appendChild(divp);
        year.firstElementChild.addEventListener("click", function () {
            expand(this);
        });
        div = createDiv(["months"]);
        parent.lastElementChild.appendChild(div);
        let monthsList = parent.lastElementChild.lastElementChild;
        if (i == 0) {
            j = dStart[0] - 1;
            max = 12;
        } else if (i == yrs) {
            j = 0;
            max = dEnd[0] - 1;
        } else {
            j = 0;
            max = 12;
        }
        for (j; j < max; j++) {
            let month = createDiv(["month", "flex"]);
            monthsList.appendChild(month);
            let divp = createDivP();
            let mname = divp;
            mname.firstElementChild.innerHTML = monthList[j];
            month.appendChild(mname);
            let stats = monthCalc();
            for (let i = 0; i < stats.length; i++) {
                let statp = createDivP();
                if (i >= stats.length - 3) {
                    yearStats[i] = stats[i];

                } else {
                    yearStats[i] += stats[i];
                }
                if (i < stats.length - 1) {
                    statp.firstElementChild.innerHTML = "₹ " + format(Math.round(stats[i]));
                } else {
                    statp.firstElementChild.innerHTML = stats[i];
                }
                month.appendChild(statp);
            }
        }
        for (let i = 0; i < yearStats.length; i++) {
            let divp = createDivP()
            if (i < yearStats.length - 1) {
                if (yearStats[i] == -0) {
                    yearStats[i] = 0;
                } else {

                }
                divp.firstElementChild.innerHTML = "₹ " + format(Math.round(yearStats[i]));
            } else {
                divp.firstElementChild.innerHTML = yearStats[i];
            }
            year.appendChild(divp);
        }
    }
}

function expand(e) {
    let content = e.parentElement.nextElementSibling
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        e.firstElementChild.innerHTML = "+";
        e.parentElement.classList.remove("active");
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        e.parentElement.classList.add("active");
        e.firstElementChild.innerHTML = "-";
    }
}

function monthCalc() {
    dInt = (balPriciplal * (i / 100)) / 12;
    let prin = emi - dInt;
    balPriciplal -= prin;
    balPayment -= emi;
    let paid = 100 - ((balPriciplal * 100) / principal);
    return [Math.round(prin), Math.round(dInt), Math.round(emi), Math.round(balPriciplal), Math.round(balPayment), paid.toFixed(2)];
}

function clear() {
    let parent = document.querySelector(".list");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createDiv(clas) {
    let div = document.createElement("div");
    clas.forEach(c => {
        div.classList.add(c);
    });
    return div;
}

function createDivP() {
    let div = document.createElement("div");
    div.appendChild(document.createElement("p"));
    return div;
}