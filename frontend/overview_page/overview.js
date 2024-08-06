document.addEventListener("DOMContentLoaded", function () {
    // 处理返回按钮的点击事件
    var backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", function () {
        window.location.href = "../popup.html";
    });

    // 从 localStorage 中获取 persona 数据
    const personaData = localStorage.getItem('selectedPersona');

    if (personaData) {
        // 解析 persona 数据
        const persona = JSON.parse(personaData);

        // 获取 DOM 元素
        const personaImage = document.querySelector('.personaImage');
        const briefInfo = document.querySelector('.briefInfo');
        const naturalInfo = document.querySelector('.naturalInfo');

        // 设置 persona 数据到页面元素
        personaImage.src = "../" + persona.profileImgUrl;
        briefInfo.innerHTML = `
            <p><span class="bold">${persona.name}</span>&middot ${persona.age}</p>
            <p>${persona.job} &middot ${persona.city}</p>
        `;
       
        const onlineBehavior = persona.online_behavior;
        const onlineBehaviorPresent = onlineBehavior.split(' ').slice(0, 20).join(' ') + "...";
        naturalInfo.innerHTML = `
            <p>${onlineBehaviorPresent}</p>
        `;

        // 清除 persona 数据以避免在刷新后重复使用
        //localStorage.removeItem('selectedPersona');
    } else {
        console.error('No persona data found in localStorage');
    }
});