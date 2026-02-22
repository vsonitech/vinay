document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});

document.addEventListener("keydown", function(e){
    if (e.ctrlKey && ["u","c","s"].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
});

window.calculate = function() {
    let a = document.getElementById("name").value.trim().toUpperCase();
    let b = document.getElementById("pan").value.trim().toUpperCase();
    let c = document.getElementById("designation").value;
    let d = document.getElementById("bank").value.trim();
    let e = document.getElementById("mobile").value.trim();
    let f = document.getElementById("gross").value.trim();
    let g = document.getElementById("taxPaid").value.trim();

    if (!a || !b || !c || !d || !e || !f || !g) {
        alert("All fields are compulsory.");
        return;
    }

    if (e.length !== 10) {
        alert("Mobile number must be 10 digits.");
        return;
    }

    if (b.length !== 10) {
        alert("PAN must be 10 characters.");
        return;
    }

    f = parseFloat(f);
    g = parseFloat(g);

    let h = new Date().toLocaleDateString("en-GB");
    let i = f - 75000;
    let j = Math.round(i / 10) * 10;

    let k = j < 400001 ? 0 : j > 800000 ? 20000 : 0.05 * (j - 400000);
    let l = j < 800001 ? 0 : j > 1200000 ? 40000 : 0.1 * (j - 800000);
    let m = j < 1200001 ? 0 : j > 1600000 ? 60000 : 0.15 * (j - 1200000);
    let n = j < 1600001 ? 0 : j > 2000000 ? 80000 : 0.2 * (j - 1600000);
    let o = j < 2000001 ? 0 : j > 2400000 ? 100000 : 0.25 * (j - 2000000);
    let p = j < 2400001 ? 0 : 0.3 * (j - 2400000);

    let q = k + l + m + n + o + p;
    let r = j < 1200001 ? q : j > 1270584 ? 0 : q - (j - 1200000);
    let s = q - r;
    let t = Math.round(0.04 * s);
    let u = s + t;
    let v = g - u;

    document.getElementById("outName").innerText = a;
    document.getElementById("outPan").innerText = b;
    document.getElementById("outDesignation").innerText = c;
    document.getElementById("outBank").innerText = d;
    document.getElementById("outMobile").innerText = e;
    document.getElementById("outDate").innerText = h;

    document.getElementById("grossOut").innerText = f.toLocaleString("en-IN") + "₹";
    document.getElementById("taxable").innerText = i.toLocaleString("en-IN") + "₹";
    document.getElementById("rounded").innerText = j.toLocaleString("en-IN") + "₹";

    document.getElementById("slab1").innerText = Math.round(k).toLocaleString("en-IN") + "₹";
    document.getElementById("slab2").innerText = Math.round(l).toLocaleString("en-IN") + "₹";
    document.getElementById("slab3").innerText = Math.round(m).toLocaleString("en-IN") + "₹";
    document.getElementById("slab4").innerText = Math.round(n).toLocaleString("en-IN") + "₹";
    document.getElementById("slab5").innerText = Math.round(o).toLocaleString("en-IN") + "₹";
    document.getElementById("slab6").innerText = Math.round(p).toLocaleString("en-IN") + "₹";

    document.getElementById("incomeTax").innerText = Math.round(q).toLocaleString("en-IN") + "₹";
    document.getElementById("rebate").innerText = Math.round(r).toLocaleString("en-IN") + "₹";
    document.getElementById("netTax").innerText = Math.round(s).toLocaleString("en-IN") + "₹";
    document.getElementById("cess").innerText = t.toLocaleString("en-IN") + "₹";
    document.getElementById("totalLiability").innerText = u.toLocaleString("en-IN") + "₹";
    document.getElementById("taxPaidOut").innerText = g.toLocaleString("en-IN") + "₹";

    let label = document.getElementById("finalLabel");
    let refund = document.getElementById("refund");

    if (v > 0) {
        label.innerText = "Income Tax Refundable";
        refund.style.color = "var(--success-color)";
        refund.innerText = "-" + v.toLocaleString("en-IN") + "₹";
    } else if (v < 0) {
        label.innerText = "Income Tax Payable";
        refund.style.color = "var(--danger-color)";
        refund.innerText = Math.abs(v).toLocaleString("en-IN") + "₹";
    } else {
        label.innerText = "Income Tax Settlement";
        refund.innerText = "0₹";
    }

    let outputSec = document.getElementById("outputSection");
    outputSec.classList.add("slide-up-anim"); // Triggers animation
    outputSec.style.display = "block";
        // Smoothly scroll down to the results
    document.getElementById("outputSection").scrollIntoView({ behavior: "smooth", block: "start" });
    
};

function exportPDF() {
    const element = document.getElementById("outputSection");

    if (!element) {
        alert("Output not found");
        return;
    }

    // 1. Hide the print buttons
    const btnRow = element.querySelector(".button-row.no-print");
    if (btnRow) btnRow.style.display = "none";

    // 2. Temporarily lock the table to a fixed desktop width so it doesn't squish or blank out
    const oldWidth = element.style.width;
    const oldMaxWidth = element.style.maxWidth;
    const oldOverflow = element.style.overflowX;
    const oldAnimation = element.style.animation;
    
        // Change the width from 800px to 720px to shrink the total height
    element.style.width = "720px";
    element.style.maxWidth = "720px";
    element.style.overflowX = "visible";
    element.style.animation = "none";

    const opt = {
        // [Top, Right, Bottom, Left] in inches. 0.05 pulls it right to the top!
        margin:       [0.05, 0.15, 0.1, 0.15], 
        filename:     "Salary_Certificate_2025-26.pdf",
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            windowWidth: 720,    // Make sure this matches the 720px above
            scrollY: 0,
            scrollX: 0
        },
        jsPDF:        { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };

}
