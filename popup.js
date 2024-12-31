function getActiveTab() {
  return chrome.tabs.query({ active: !0, currentWindow: !0 }).then((e) => e[0]);
}
function showMessage(e, t) {
  (e._originalText = e._originalText || e.textContent),
    (e.textContent = t),
    e.setAttribute("disabled", "true"),
    clearTimeout(e._timeout),
    (e._timeout = setTimeout(() => {
      (e.textContent = e._originalText), e.removeAttribute("disabled");
    }, 2e3));
}
(document.getElementById("version-string").textContent =
  chrome.runtime.getManifest().version),
  document
    .getElementById("bypass-video")
    .addEventListener("click", async (e) => {
      const t = await getActiveTab();
      let n = e.currentTarget || e.target;
      if (
        (n.matches("button") || (n = n.closest("button")),
        !t.url.includes("vulms.vu.edu.pk") ||
          !t.url.includes("LessonViewer.aspx"))
      )
        return showMessage(n, "Only works on Lesson page.");
      showMessage(n, "In Progress"),
        chrome.scripting
          .executeScript({
            target: { tabId: t.id },
            world: "MAIN",
            func: function () {
              return new Promise((e, t) => {
                const n = $("#hfActiveTab").val().replace("tabHeader", ""),
                  o = document.querySelector(
                    `li[data-contentid="tab${n}"]`
                  ).nextElementSibling,
                  r = o?.dataset?.contentid?.replace?.("tab", "") ?? "-1",
                  s = $("#hfIsVideo" + n)?.val();
                if (!s || "0" == s) return e("Not a video tab");
                const i = $("#hfContentID" + n).val(),
                  a = $("#hfIsAvailableOnYoutube" + n).val(),
                  u = $("#hfIsAvailableOnLocal" + n).val(),
                  c = $("#hfVideoID" + n).val();
                let l = "";
                const d = $("#hfStudentID").val(),
                  g = $("#hfCourseCode").val(),
                  p = $("#hfEnrollmentSemester").val(),
                  f = document
                    .getElementById("MainContent_lblLessonTitle")
                    .title.split(":")[0]
                    .replace("Lesson", "")
                    .trim();
                function m(e, t) {
                  return Math.floor(Math.random() * (t - e + 1) + e);
                }
                "True" == a
                  ? (l = CurrentPlayer.getDuration())
                  : "True" == u && (l = CurrentLVPlayer.duration);
                let v = m(120, 180);
                ("True" != a && "True" != u) ||
                  (v = m(Number(l) / 3, Number(l) / 2)),
                  PageMethods.SaveStudentVideoLog(
                    d,
                    g,
                    p,
                    f,
                    i,
                    v,
                    l,
                    c,
                    s,
                    window.location.href,
                    function (t) {
                      UpdateTabStatus(t, n, r), e("Bypassed");
                    }
                  );
              });
            },
          })
          .then((e) => {
            "string" == typeof e[0].result && showMessage(n, e[0].result);
          });
    }),
  // document
  //   .getElementById("allow-events")
  //   .addEventListener("click", async function (e) {
  //     let t = e.currentTarget || e.target;
  //     t.matches("button") || (t = t.closest("button")),
  //       showMessage(t, "In Progress"),
  //       chrome.scripting
  //         .executeScript({
  //           target: { tabId: (await getActiveTab()).id, allFrames: !0 },
  //           world: "MAIN",
  //           func: function () {
  //             if (
  //               "function" != typeof window.Node?.prototype?._getEventListeners
  //             )
  //               return "Not supported";
  //             !(function (e) {
  //               "function" == typeof e.Element.prototype._getEventListeners &&
  //                 (function () {
  //                   const t = e.Array.prototype.slice.call(
  //                     e.document.querySelectorAll("*")
  //                   );
  //                   t.push(e.document), t.push(e);
  //                   const n = [
  //                     "copy",
  //                     "paste",
  //                     "cut",
  //                     "contextmenu",
  //                     "keyup",
  //                     "keypress",
  //                     "keydown",
  //                     "auxclick",
  //                   ];
  //                   let o = [];
  //                   for (const e of t) {
  //                     if ("function" != typeof e._getEventListeners) continue;
  //                     const t = e._getEventListeners();
  //                     for (const e in t) {
  //                       if (!n.includes(e)) continue;
  //                       const r = t[e];
  //                       for (const e of r) o.push(e.controller);
  //                     }
  //                   }
  //                   return o;
  //                 })().forEach((e) => {
  //                   e.abort();
  //                 });
  //             })(window);
  //           },
  //         })
  //         .then((e) => {
  //           const n = e.every((e) => "string" == typeof e.result);
  //           showMessage(
  //             t,
  //             n
  //               ? "Not supported on this page."
  //               : "Done! You can now copy, paste."
  //           );
  //         });
  //   }),
  // getActiveTab().then((e) => {
  //   "string" == typeof e.url &&
  //     e.url.includes("vulms.vu.edu.pk") &&
  //     e.url.includes("GDB/StudentMessage.aspx") &&
  //     document.getElementById("gdb-copy-paste").classList.remove("hidden");
  // });

  //   document.getElementById("bypass-quiz").addEventListener("click",()=>{
  //     // FAQQuiz();
  //      // Select all input elements of type "hidden"
  //      const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
  //      let activeTabElement = document.getElementById('hfActiveTab');
  //      console.log("activetab",activeTabElement);
  //      if (!activeTabElement) {
  //        console.error("Element with ID 'hfActiveTab' not found.");
  //        return; // Exit the function if the element is not found
  //    }

  //    let th = activeTabElement.value;
  //  // Extract the numeric part using a regular expression
  //      const numericPart = th.match(/\d+/)[0];
  //      const hfIsVideo = "hfIsVideo"+numericPart;

  //      // Loop through each hidden input and change its type to "text"
  //      hiddenInputs.forEach(input => {
  //          if(input.id == hfIsVideo){
  //          // input.type = 'visible'; // Change type to 'text'
  //          input.value = "1";
  //          console.log("input is:",input);
  //          }
  //      });
  //   })
  // function FAQQuiz(){
  //     // Select all input elements of type "hidden"
  //     const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
  //     let activeTabElement = document.getElementById('hfActiveTab');
  //     if (!activeTabElement) {
  //       console.error("Element with ID 'hfActiveTab' not found.");
  //       return; // Exit the function if the element is not found
  //   }

  //   let th = activeTabElement.value;
  // // Extract the numeric part using a regular expression
  //     const numericPart = th.match(/\d+/)[0];
  //     const hfIsVideo = "hfIsVideo"+numericPart;

  //     // Loop through each hidden input and change its type to "text"
  //     hiddenInputs.forEach(input => {
  //         if(input.id == hfIsVideo){
  //         // input.type = 'visible'; // Change type to 'text'
  //         input.value = "1";
  //         console.log("input is:",input);
  //         }
  //     });
  // }
  // FAQQuiz();

  //quiz bypass start
  document.getElementById("bypass-quiz").addEventListener("click", () => {
    // const t =  getActiveTab();
    //   if (t.url.includes("vulms.vu.edu.pk") || t.url.includes("LessonViewer.aspx"))
    //     return console.log("not vu url",t.url);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: bypassQuiz,
      });
    });
  });
//quiz bypass End

//Next Lecture Start
document.getElementById("next-lecture").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: next,
    });
  });
});

//Next Lecture End
function next() {
  // Find the button by its ID
  const button = document.getElementById("lbtnNextLesson");
  if (button) {
    // Create a new MouseEvent to simulate a click
    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    button.dispatchEvent(clickEvent);
  } else {
    console.error("Button not found!");
  }
}

function bypassQuiz() {
  const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
  let activeTabElement = document.getElementById("hfActiveTab");
  console.log("activetab", activeTabElement);

  if (!activeTabElement) {
    console.error("Element with ID 'hfActiveTab' not found.");
    return; // Exit the function if the element is not found
  }

  let th = activeTabElement.value;
  const numericPart = th.match(/\d+/)[0];
  const hfIsVideo = "hfIsVideo" + numericPart;

  hiddenInputs.forEach((input) => {
    if (input.id == hfIsVideo) {
      input.value = "1";
      console.log("input is:", input);
    }
  });
}

//Code for quiz copying
// let quizURL = window.location.href;
const quizURL = await getActiveTab();
console.log("quizURl iss:", quizURL.url);
console.log("quizURl includes before iss :", quizURL.url.includes("Quiz"));
if (!quizURL.url.includes("Quiz")) {
  console.log("quizURl includes after iss:", quizURL.url.includes("Quiz"));
  document.getElementById("quiz-button").setAttribute("disabled", "true");
}

document.getElementById("quiz-button").addEventListener("click", () => {
  // Get the textarea element by ID
  // let newTextArea = document.getElementById("quiz-text");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: quiz,
      // args: [newTextArea.value],
    });
  });
});

function quiz() {
  const allSpans = document.querySelectorAll("*"); // Select all div elements
  const matchingElements = [];

  allSpans.forEach((span) => {
    const computedStyle = window.getComputedStyle(span);
    if ((computedStyle.borderLeftColor === "rgb(38, 117, 158)") &&
      (computedStyle.borderLeftStyle !== "none") &&
      (parseFloat(computedStyle.borderLeftWidth) > 4)) {
    // if (parseFloat(computedStyle.borderLeftWidth) > 4.5) {
      matchingElements.push(span);
      console.log("matched Span is::", span);
      console.log(
        "matched Span borderleftColor is::",
        computedStyle.borderLeftColor
      );
      console.log(
        "matched Span borderLeftStyle is::",
        computedStyle.borderLeftStyle
      );
      console.log(
        "matched Span borderLeftWidth is::",
        parseFloat(computedStyle.borderLeftWidth)
      );
    }
    // else
    // console.log("not matched");
  });
  let v = matchingElements[0].innerHTML;
  console.log("v is:", v);

  function trimerFunction(s) {
    // Your variable containing the HTML string
    let htmlString = " ";

    // Step 1: Remove escape characters and trim whitespace
    htmlString = s.replace(/\\n/g, " ").trim();

    // Step 2: Create a temporary DOM element to parse the HTML
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    console.log("innerHTML 1 executed");

    // Step 3: Extract the text content
    let extractedText = tempDiv.textContent || tempDiv.innerText || "";
    console.log("innerHTML 2 executed");

    // Step 4: Trim the final result to remove any extra whitespace
    extractedText = extractedText.trim();

    console.log("extracted text is: ", extractedText); // Output: "In PL/SQL procedure, how many types of parameters can be used?"
    return extractedText;
  }

  let Question = trimerFunction(v);
  console.log("innerHTML 3 Before executed");
  let ans0 = document.getElementById("lblAnswer0");
  let mcq0 = document.getElementById("lblExpression0");
  let choice0, choice1, choice2, choice3;

  if (ans0) {
    choice0 = ans0.innerHTML;
  } else {
    choice0 = mcq0.innerHTML;
  }
  console.log("innerHTML 3 after executed", mcq0);

  mcq0 = trimerFunction(choice0);

  let mcq1 = document.getElementById("lblExpression1");
  let ans1 = document.getElementById("lblAnswer1");
  if (ans1) {
    choice1 = ans1.innerHTML;
  } else {
    choice1 = mcq1.innerHTML;
  }
  mcq1 = trimerFunction(choice1);

  let mcq2 = document.getElementById("lblExpression2");
  let ans2 = document.getElementById("lblAnswer2");
  if (ans2) {
    choice2 = ans2.innerHTML;
  } else {
    choice2 = mcq2.innerHTML;
  }
  mcq2 = trimerFunction(choice2);

  let mcq3 = document.getElementById("lblExpression3");
  let ans3 = document.getElementById("lblAnswer3");
  if (ans3) {
    choice3 = ans3.innerHTML;
  } else {
    choice3 = mcq3.innerHTML;
  }
  mcq3 = trimerFunction(choice3);

  // Concatenate the question and multiple-choice answers
  let extractedText =
    Question +
    "\n 1. " +
    mcq0 +
    "\n 2. " +
    mcq1 +
    "\n 3. " +
    mcq2 +
    "\n 4. " +
    mcq3 +
    "\n";

  // // Get the textarea element by ID
  // let newTextArea = document.getElementById("quiz-text");
  // let newText = document.createElement("div");
  // newText.innerText = extractedText;
  // document.getElementById("div1").append(newText);

  // Create the popup div
  const popup = document.createElement("div");
  popup.style.display = "flex"; // Show the popup
  popup.style.position = "fixed"; // Stay in place
  popup.style.zIndex = "1"; // Sit on top
  popup.style.left = "0";
  popup.style.top = "0";
  popup.style.width = "100%"; // Full width
  popup.style.height = "100%"; // Full height
  popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Black background with opacity
  popup.style.justifyContent = "center"; // Center horizontally
  popup.style.alignItems = "center"; // Center vertically

  // Create the content div
  const popupContent = document.createElement("div");
  popupContent.style.backgroundColor = "white"; // White background
  popupContent.style.padding = "20px";
  popupContent.style.borderRadius = "5px";
  popupContent.style.textAlign = "center";

  // Create the text to be copied
  const textToCopy = document.createElement("p");
  textToCopy.id = "textToCopy";
  // textToCopy.innerText = 'This is the text to be copied!';
  textToCopy.innerText = extractedText;

  // Create the copy button
  const copyButton = document.createElement("button");
  copyButton.innerText = "Copy Text";
  copyButton.addEventListener("click", function () {
    const text = textToCopy.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard!");
        popup.style.display = "none"; /////////////////////////////////
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  });

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.marginLeft = "20px";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(popup); // Remove the popup from the DOM
  });

  // Append elements to the popup content
  popupContent.appendChild(textToCopy);
  popupContent.appendChild(copyButton);
  popupContent.appendChild(closeButton);

  // Append content to the popup
  popup.appendChild(popupContent);

  // Append the popup to the body
  document.body.appendChild(popup);

  return extractedText;
}
// let extracted = quiz();
// newTextArea = document.getElementById("quiz-text");

// // Check if the element exists before trying to set its value
// if (newTextArea) {
//     newTextArea.value = extractedText; // Use value for textarea
//     console.log("newTextArea: ",newTextArea);
// } else {
//     console.error("Element with ID 'quiz-text' not found.");
// }
// let newTextArea = document.createElement("textarea");
// newTextArea.value += extractedText;
// document.getElementById("div3").append(newTextArea);
// let t = await getActiveTab();
document.addEventListener("DOMContentLoaded",()=>{
  if (window.location.href.includes("survey.vu.edu.pk")) {
    window.location.href = "https://vulms.vu.edu.pk";
    console.log("servey bypassed.");
}
})