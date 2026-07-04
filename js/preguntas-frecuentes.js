document.addEventListener('DOMContentLoaded', () => {

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {

            item.classList.toggle('active');
        });
    });

});