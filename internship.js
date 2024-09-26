const puppeteer = require('puppeteer');
const coverLetterText = require('./cover'); // Adjust the path if necessary

(async () => {
    try {
        // Launch the browser
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized']
        });

        // Open a new page
        const page = await browser.newPage();

        // Go to Internshala
        await page.goto('https://internshala.com/', { waitUntil: 'networkidle2' });

        // Wait for and click the login button
        await page.waitForSelector('button[data-toggle="modal"][data-target="#login-modal"].login-cta', { visible: true });
        await page.click('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
        console.log('Login button clicked!');

        // Wait for the login modal to appear
        await page.waitForSelector('#login-modal', { visible: true });

        // Fill out and submit the login form
        await page.waitForSelector('#modal_email', { visible: true });
        await page.type('#modal_email', 'reshavlalrocks@gmail.com', { delay: 100 });
        await page.waitForSelector('#modal_password', { visible: true });
        await page.type('#modal_password', 'Great@789', { delay: 101 });
        console.log('Email and password entered.');
        await page.waitForSelector('button#modal_login_submit', { visible: true });
        await page.click('button#modal_login_submit');
        console.log('Login button inside modal clicked.');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('Navigation completed.');

        // Navigate to Internships page
        await page.waitForSelector('a.nav-link.dropdown-toggle.internship_link', { visible: true });
        await page.click('a.nav-link.dropdown-toggle.internship_link');
        console.log('Internships link clicked.');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('Navigation to Internships page completed.');

        // Profile and location settings
        const profileName = ' Full Stack Development'; // Desired profile name
        const locationName = ''; // Location if needed
        const chooseToWorkFromHome = true;
        const choosePartTimeWork = false;

        // Check Work from Home checkbox
        if (chooseToWorkFromHome) {
            await page.waitForSelector('#work_from_home', { visible: true });
            const isDisabled = await page.$eval('#work_from_home', el => el.disabled);
            if (!isDisabled) {
                await page.click('#work_from_home');
                console.log('Work from Home checkbox clicked.');
            } else {
                console.log('Work from Home checkbox is disabled.');
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            const isChecked = await page.$eval('#work_from_home', el => el.checked);
            console.log(isChecked ? 'Work from Home checkbox is now checked.' : 'Failed to check Work from Home checkbox.');
        }

        // Check Part-time checkbox
        if (choosePartTimeWork) {
            await page.waitForSelector('#part_time', { visible: true });
            const isDisabled = await page.$eval('#part_time', el => el.disabled);
            if (!isDisabled) {
                await page.click('#part_time');
                console.log('Part-time checkbox clicked.');
            } else {
                console.log('Part-time checkbox is disabled.');
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            const isChecked = await page.$eval('#part_time', el => el.checked);
            console.log(isChecked ? 'Part-time checkbox is now checked.' : 'Failed to check Part-time checkbox.');
        }

        // Search for internships
        await page.waitForSelector('input[value="e.g. Marketing"]', { visible: true });
        await page.type('input[value="e.g. Marketing"]', profileName, { delay: 100 });
        await page.keyboard.press('Enter');
        console.log(`Typed "${profileName}" into profile search input and pressed Enter.`);
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (locationName) {
            await page.waitForSelector('input[value="e.g. Delhi"]', { visible: true });
            await page.type('input[value="e.g. Delhi"]', locationName, { delay: 100 });
            console.log(`Typed "${locationName}" into location search input and pressed Enter.`);
            await page.keyboard.press('Enter');
        }
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Select and apply to the first internship
        await page.waitForSelector('div.individual_internship_details.individual_internship_internship', { visible: true });
        const internshipContainers = await page.$$('div.individual_internship_details.individual_internship_internship');

        if (internshipContainers.length === 0) {
            console.log('No internships found.');
        } else {
            await internshipContainers[1].click();
            console.log('Clicked on the first internship heading container.');
            await new Promise(resolve => setTimeout(resolve, 10000));

            try {
                await page.waitForSelector('button#continue_button.btn.btn-large', { visible: true, timeout: 60000 });
                await page.click('button#continue_button.btn.btn-large');
                console.log('Continue button clicked.');
                await new Promise(resolve => setTimeout(resolve, 5000));
            } catch (error) {
                console.error('Error clicking continue button:', error);
            }

            // Handle the cover letter
            await page.waitForSelector('#cover_letter_holder', { visible: true });
            await page.click('#cover_letter_holder', { clickCount: 3 });
            await page.type('#cover_letter_holder', coverLetterText, { delay: 10 });
            console.log('Typed cover letter into the cover letter container.');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Count and log assessment questions
            const countAndLogAssessmentQuestions = async () => {
                const questions = await page.$$('.assessment_question');
                console.log(`Number of assessment questions: ${questions.length - 1}`); // Exclude cover letter

                if (questions.length > 1) { // Skip first element
                    for (let i = 1; i < questions.length; i++) {
                        const questionText = await page.evaluate(el => {
                            const label = el.querySelector('label');
                            return label ? label.textContent.trim() : 'No question text found';
                        }, questions[i]);
                        console.log(`Question ${i}: ${questionText}`);
                    }
                } else {
                    console.log('No assessment questions to log.');
                }
            };

            await countAndLogAssessmentQuestions();
            await new Promise(resolve => setTimeout(resolve, 1000));

            const answer = 'Your answer here'; // Define the answer variable

            // Ensure the textareas are properly loaded and visible
            const textareas = await page.$$('textarea.textarea.form-control');
            if (textareas.length === 0) {
                console.log('No textareas found.');
            } else {
                console.log(`Found ${textareas.length-2} textareas.`);
                for (let i = 2; i < textareas.length; i++) {
                    // Wait for the textarea to be visible and enabled
                    await page.waitForFunction(textarea => textarea && !textarea.disabled, {}, textareas[i]);
            
                    // Focus on the current textarea
                    await textareas[i].focus();
                    
                    // Clear any existing content using JavaScript
                    await page.evaluate(textarea => textarea.value = '', textareas[i]);
            
                    // Type the answer into the current textarea using JavaScript
                    await page.evaluate((textarea, answer) => {
                        textarea.value = answer;
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    }, textareas[i], answer);
            
                    console.log(`Typed answer into textarea ${i}`);
            
                    // Optional: Add a short delay between typing into each textarea
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Submit the form
            try {
                await page.waitForSelector('#submit', { visible: true });
                await page.click('#submit');
                console.log('Submit button clicked.');
            } catch (error) {
                console.error('Error clicking submit button:', error);
            }
        }

        // Keep the browser open for further actions or debugging
        console.log('Browser is open. Press Ctrl+C to exit.');
        await new Promise(resolve => {});

    } catch (error) {
        console.error('Error:', error);
    }
})();
