/**
 * Abhiram Madire - Portfolio Script
 * Dynamic functionality, animations, and interactivity.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER & SCROLL PROGRESS
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const scrollIndicator = document.getElementById('scrollIndicator');

    // Fade out preloader when page finishes loading
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Fallback: in case window load event doesn't trigger quickly
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 2000);

    // Scroll Progress Indicator
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollIndicator) {
            scrollIndicator.style.width = scrolled + '%';
        }
    });


    /* ==========================================================================
       2. TYPING EFFECT (HERO SECTION)
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    const words = [
        "Data Science Student", 
        "Statistics Analyst", 
        "Prompt Engineering Researcher", 
        "Problem Solver"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Add character
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // Word completely typed
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at the end of word
            isDeleting = true;
        } 
        // Word completely erased
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typingSpan) {
        // Start the typing loop
        setTimeout(type, 1000);
    }


    /* ==========================================================================
       3. STICKY NAVBAR & BACK-TO-TOP BUTTON
       ========================================================================== */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Header
        if (scrollPos > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Back to Top Button visibility
        if (scrollPos > 400) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });


    /* ==========================================================================
       4. MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navbar) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNavToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') && !navbar.contains(e.target) && e.target !== mobileNavToggle) {
                mobileNavToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       5. ACTIVE SECTION HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavbar() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Offset for sticky header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.navbar a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavbar);


    /* ==========================================================================
       6. SCROLL REVEAL & SKILL BARS ANIMATION
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillsSection = document.getElementById('skills');

    // Setup Intersection Observer for Scroll Reveals
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Observer for animating Skill Bars when the section is entered
    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('style').match(/--width:\s*(\d+)%/)[1];
                        bar.style.width = targetWidth + '%';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       7. CONTACT FORM VALIDATION & MOCK SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const formStatus = document.getElementById('formStatus');

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function checkInput(input, condition, errorElId) {
        const group = input.closest('.form-group');
        if (condition) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    }

    // Input event listeners to clear errors on type
    if (contactForm) {
        nameInput.addEventListener('input', () => checkInput(nameInput, nameInput.value.trim() !== '', 'name-error'));
        emailInput.addEventListener('input', () => checkInput(emailInput, validateEmail(emailInput.value.trim()), 'email-error'));
        subjectInput.addEventListener('input', () => checkInput(subjectInput, subjectInput.value.trim() !== '', 'subject-error'));
        messageInput.addEventListener('input', () => checkInput(messageInput, messageInput.value.trim() !== '', 'message-error'));

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all inputs
            const isNameValid = checkInput(nameInput, nameInput.value.trim() !== '', 'name-error');
            const isEmailValid = checkInput(emailInput, validateEmail(emailInput.value.trim()), 'email-error');
            const isSubjectValid = checkInput(subjectInput, subjectInput.value.trim() !== '', 'subject-error');
            const isMessageValid = checkInput(messageInput, messageInput.value.trim() !== '', 'message-error');

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                // Submit button status change
                const submitBtn = document.getElementById('submitFormBtn');
                const originalBtnHTML = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-circle-notch fa-spin"></i>';

                // Simulate form sending via AJAX/fetch (mock)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;

                    // Display success status
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! Thank you, ' + nameInput.value.trim() + '.';
                    
                    // Reset form fields
                    contactForm.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);

                }, 1500);
            } else {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please correct the highlighted errors above.';
                formStatus.style.display = 'block';
            }
        });
    }


    /* ==========================================================================
       8. MOCK RESUME DOWNLOAD GENERATOR
       ========================================================================== */
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');

    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // In a real application, this link would target the static PDF.
            // As a high-quality fallback, we will generate a clean printable text representation 
            // of Abhiram Madire's Resume in a new tab, or offer to trigger system printing.
            
            const printConfirmed = confirm("Would you like to open a print-friendly version of Abhiram Madire's Resume? (You can save it directly as a PDF from your browser)");
            
            if (printConfirmed) {
                const resumeWindow = window.open('', '_blank');
                
                const resumeHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Resume - Abhiram Madire</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.5;
                            color: #333;
                            max-width: 800px;
                            margin: 40px auto;
                            padding: 0 20px;
                        }
                        h1 {
                            text-align: center;
                            margin-bottom: 5px;
                            color: #111;
                            font-size: 28px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .contact-info {
                            text-align: center;
                            margin-bottom: 25px;
                            font-size: 14px;
                            color: #666;
                            border-bottom: 2px solid #333;
                            padding-bottom: 15px;
                        }
                        .summary {
                            margin-bottom: 25px;
                            font-style: italic;
                            color: #444;
                            text-align: justify;
                        }
                        h2 {
                            border-bottom: 1px solid #ddd;
                            padding-bottom: 5px;
                            color: #0f172a;
                            font-size: 16px;
                            text-transform: uppercase;
                            margin-top: 25px;
                            margin-bottom: 12px;
                            letter-spacing: 0.5px;
                        }
                        .section-item {
                            margin-bottom: 15px;
                        }
                        .item-header {
                            display: flex;
                            justify-content: space-between;
                            font-weight: bold;
                            color: #222;
                        }
                        .item-sub {
                            display: flex;
                            justify-content: space-between;
                            font-style: italic;
                            color: #555;
                            margin-top: 2px;
                            margin-bottom: 6px;
                        }
                        ul {
                            margin: 0;
                            padding-left: 20px;
                        }
                        li {
                            margin-bottom: 4px;
                            text-align: justify;
                        }
                        .skills-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        }
                        .skills-table td {
                            padding: 4px 0;
                            vertical-align: top;
                        }
                        .skills-table td.label {
                            font-weight: bold;
                            width: 150px;
                            color: #222;
                        }
                        @media print {
                            body { margin: 20px; }
                            button { display: none; }
                        }
                        .print-btn-container {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .print-btn {
                            background-color: #6366f1;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            font-size: 14px;
                            font-weight: bold;
                            border-radius: 4px;
                            cursor: pointer;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        }
                        .print-btn:hover {
                            background-color: #4f46e5;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-btn-container">
                        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
                    </div>
                    <h1>ABHIRAM MADIRE</h1>
                    <div class="contact-info">
                        +1 (904) 484-8439 &bull; madire.abhiram@googlemail.com &bull; LinkedIn: linkedin.com/in/abhiram-madire
                    </div>
                    
                    <div class="summary">
                        Data Science and Statistics student at UCF with a strong foundation in programming, statistical analysis, and artificial intelligence. Experienced in prompt engineering research, community outreach, and peer instruction. Passionate about applying data-driven thinking and emerging AI technologies to solve real-world problems. Actively expanding expertise through certifications in data analytics and prompt engineering.
                    </div>

                    <h2>EDUCATION</h2>
                    <div class="section-item">
                        <div class="item-header">
                            <span>University of Central Florida (UCF) &mdash; Orlando, FL</span>
                            <span>Expected May 2029</span>
                        </div>
                        <div class="item-sub">
                            <span>Bachelor of Science in Data Science | Bachelor of Science in Statistics</span>
                        </div>
                        <div style="font-size: 13px;">
                            <strong>Relevant Coursework:</strong> Introduction to Programming with C (COP3223C), Computer Science I (COP3502C), Statistical Methods I (STA2023), Statistical Methods II (STA4163)
                        </div>
                    </div>

                    <div class="section-item">
                        <div class="item-header">
                            <span>Beachside High School &mdash; St. Johns, FL</span>
                            <span>May 2025</span>
                        </div>
                        <div class="item-sub">
                            <span>High School Diploma</span>
                            <span>Unweighted GPA: 3.8/4.0</span>
                        </div>
                    </div>

                    <h2>TECHNICAL SKILLS</h2>
                    <table class="skills-table">
                        <tr>
                            <td class="label">Languages:</td>
                            <td>C, Python (basic), SQL (basic)</td>
                        </tr>
                        <tr>
                            <td class="label">Tools & Software:</td>
                            <td>Microsoft Excel, AI Tools</td>
                        </tr>
                        <tr>
                            <td class="label">Soft Skills:</td>
                            <td>Communication, Presentation, Analytical Thinking, Problem Solving, Critical Thinking</td>
                        </tr>
                    </table>

                    <h2>PROJECTS</h2>
                    <div class="section-item">
                        <div class="item-header">
                            <span>Prompt Engineering Research Study</span>
                            <span>Spring 2026</span>
                        </div>
                        <div class="item-sub">
                            <span>ENC1102 &mdash; University of Central Florida</span>
                        </div>
                        <ul>
                            <li>Designed and conducted a primary research study analyzing how prompt structure affects AI response quality using Google NotebookLM.</li>
                            <li>Compared three prompt types &mdash; baseline, role-based, and structured exam-context prompts &mdash; across eight qualitative coding categories.</li>
                            <li>Produced a coded data table and written analysis showing that structured, role-based prompts yielded significantly more useful exam-prep responses.</li>
                        </ul>
                    </div>

                    <div class="section-item">
                        <div class="item-header">
                            <span>Mortgage Calculator</span>
                            <span>Fall 2025</span>
                        </div>
                        <div class="item-sub">
                            <span>Personal Project &mdash; Python</span>
                        </div>
                        <ul>
                            <li>Built a Python-based mortgage calculator that computes monthly payments using home price, down payment, interest rate, and loan term inputs.</li>
                            <li>Added features to compare payment strategies such as bi-weekly payments, extra principal payments, and lump-sum contributions.</li>
                            <li>Created amortization calculations to show how payments are divided between principal and interest over the life of the loan.</li>
                        </ul>
                    </div>

                    <h2>CERTIFICATIONS & COURSEWORK</h2>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>AI for Work and Life</strong> &mdash; University of North Florida (UNF) <span style="float: right;">2025</span>
                        <div style="font-size: 13px; color: #555;">Completed a professional development course on applying artificial intelligence tools in academic and workplace contexts.</div>
                    </div>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>ChatGPT: Master AI Tools to Supercharge Productivity</strong> &mdash; Coursera <span style="float: right;">2026</span>
                        <div style="font-size: 13px; color: #555;">Completed specialization focused on leveraging AI productivity tools effectively across professional and academic workflows.</div>
                    </div>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>Google Data Analytics Professional Certificate</strong> &mdash; Google <span style="float: right;">In Progress</span>
                        <div style="font-size: 13px; color: #555;">Covering data analysis, visualization, and SQL through hands-on projects toward Google's industry-recognized certificate.</div>
                    </div>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>Prompt Engineering Masterclass: From Beginner to Advanced</strong> &mdash; Coursera <span style="float: right;">In Progress</span>
                        <div style="font-size: 13px; color: #555;">Specialization covering advanced prompt design techniques for large language models across real-world applications.</div>
                    </div>

                    <h2>COMMUNITY INVOLVEMENT</h2>
                    <div class="section-item">
                        <div class="item-header">
                            <span>Hindu Swayamsevak Sangh (HSS) &mdash; Jacksonville & St. Augustine Chapters</span>
                            <span>2024 &ndash; Present</span>
                        </div>
                        <div class="item-sub">
                            <span>Volunteer & Communications Contributor</span>
                        </div>
                        <ul>
                            <li>Drafted and coordinated community outreach communications for one of the nation's largest Hindu-American organizations.</li>
                            <li>Contributed to chapter-level event coordination and inter-chapter correspondence across St. Johns County and Jacksonville.</li>
                        </ul>
                    </div>

                    <div class="section-item">
                        <div class="item-header">
                            <span>Link Crew Leader &mdash; Beachside High School</span>
                            <span>2023 &ndash; 2025</span>
                        </div>
                        <div class="item-sub">
                            <span>Peer Mentor | Nationally Recognized Freshman Transition Program</span>
                        </div>
                        <ul>
                            <li>Selected through a competitive application process to mentor incoming freshmen as part of a nationally recognized high school transition program operating in 3,700+ schools across the U.S.</li>
                            <li>Guided a dedicated small group of freshmen through academic and social adjustment, providing hands-on support in math and science.</li>
                            <li>Helped students build relationships with teachers and counselors, navigate school resources, and develop confidence during their transition to high school.</li>
                        </ul>
                    </div>

                    <div class="section-item">
                        <div class="item-header">
                            <span>Volunteer Chess Tutor &mdash; Community Clubhouse</span>
                            <span>2023 &ndash; 2024</span>
                        </div>
                        <div class="item-sub">
                            <span>Chess Instructor | St. Johns County, FL</span>
                        </div>
                        <ul>
                            <li>Taught chess fundamentals and strategic thinking to 30&ndash;40 students drawn from three surrounding communities.</li>
                            <li>Developed structured instructional sessions for youth learners of varying skill levels, building patience and communication skills.</li>
                            <li>Helped students develop analytical reasoning and problem-solving habits through guided gameplay and post-game analysis.</li>
                        </ul>
                    </div>

                    <h2>CAMPUS ORGANIZATIONS</h2>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>American Statistical Association (AMstat) &mdash; UCF Chapter</strong> <span style="float: right;">2025 &ndash; Present</span>
                        <ul>
                            <li>Engaging with a community of statistics and data science students through workshops, events, and professional development activities.</li>
                        </ul>
                    </div>
                    <div class="section-item" style="margin-bottom: 8px;">
                        <strong>AI@UCF &mdash; Artificial Intelligence Club</strong> <span style="float: right;">2025 &ndash; Present</span>
                        <ul>
                            <li>Participating in one of UCF's leading technology organizations, exploring AI applications and collaborating on machine learning and data science projects.</li>
                        </ul>
                    </div>
                </body>
                </html>
                `;
                
                resumeWindow.document.open();
                resumeWindow.document.write(resumeHTML);
                resumeWindow.document.close();
            }
        });
    }

});
