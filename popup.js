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
function next(){
  // Find the button by its ID
  const button = document.getElementById("lbtnNextLesson");
  if (button) {
      // Create a new MouseEvent to simulate a click
      const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
      });
      button.dispatchEvent(clickEvent);
    } 
  else {
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
