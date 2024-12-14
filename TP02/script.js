document.addEventListener('DOMContentLoaded', function () {
    // Vérifier si le nom est dans le localStorage
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').textContent = username;

    // Fonction pour formater l'index de l'image avec un zéro devant pour les images de 1 à 9
    function formatImageIndex(index) {
        return index < 10 ? `0${index}` : index;  // Ajouter un zéro si l'index est inférieur à 10
    }

    // Fonction pour récupérer les données du quiz (image, catégories, propositions et descriptions)
    function fetchQuizData(imageIndex) {
        const formattedIndex = formatImageIndex(imageIndex);

        // URL de l'image
        const imageUrl = `http://localhost:81/TP02/data/${formattedIndex}.png`;
        document.getElementById('quiz-image').src = imageUrl;

        // Utilisation de fetch pour charger les données depuis un fichier PHP (ou JSON)
        fetch(`http://localhost:81/TP02/data.php?data=categories`)
            .then(response => response.json())
            .then(data => {


                document.getElementById("categories-group").innerHTML = JSON.stringify(data);
                
            
                // Les options à afficher dans les radio buttons (les catégories disponibles)
                const categories = ["Réglementation", "Danger", "Information", "Priorité"]; // Par exemple, les 4 catégories possibles
                const correctCategory = data.category; // La bonne catégorie de l'image

                // Créer les options dans le DOM
                document.getElementById('propositions-group').innerHTML = `
                    <label class="form-label">${data.description}</label>
                    <div class="d-flex flex-column">
                        ${categories.map((category, index) => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="answer" id="option${index}" value="${category}">
                                <label class="form-check-label" for="option${index}">${category}</label>
                            </div>`).join('')}
                    </div>
                `;

                // Ajouter un écouteur de clic sur le bouton suivant
                document.getElementById('next-button').addEventListener('click', function () {
                    const selectedOption = document.querySelector('input[name="answer"]:checked');
                    if (selectedOption) {
                        const selectedCategory = selectedOption.value;
                        if (selectedCategory === correctCategory) {
                            alert("Bonne réponse !");
                        } else {
                            alert(`Mauvaise réponse. La bonne catégorie était : ${correctCategory}`);
                        }

                        // Passer à la question suivante (exemple : augmenter l'index de l'image)
                        imageIndex++;
                        fetchQuizData(imageIndex);  // Charger la prochaine question
                    } else {
                        alert("Veuillez sélectionner une réponse.");
                    }
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des données :', error));
    }

    // Initialisation : Charger la première question
    fetchQuizData(1);  // Commencer avec la première question (index 1)
});