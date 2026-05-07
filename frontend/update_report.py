import re
import os

html_path = r'C:\projects\openclaw\opc_project\frontend\report-preview.html'
js_path = r'C:\projects\openclaw\opc_project\frontend\report-preview.js'
css_path = r'C:\projects\openclaw\opc_project\frontend\report-preview.css'

# Update HTML
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the specific hardcoded sections with dynamic containers
html = re.sub(
    r'<h2>🍽️ 专属饮食方案（7天）</h2>.*?<h2>🌿 季节调养重点</h2>.*?</div>',
    '''<h2>🍽️ 专属饮食方案（7天）</h2>
            <div class="diet-plan-container" id="diet-plan-container"></div>

            <h2>🧘 运动调养建议</h2>
            <div class="exercise-plan-container" id="exercise-plan-container"></div>

            <h2>🌿 季节调养重点</h2>
            <div class="seasonal-plan-container" id="seasonal-plan-container"></div>''',
    html,
    flags=re.DOTALL
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)


# Update JS
js_content = """/* ─── Report Preview Logic ─── */

(function () {
    'use strict';

    const params = new URLSearchParams(window.location.search);
    const elementMap = {
        'wood': '木型体质',
        'fire': '火型体质',
        'earth': '土型体质',
        'metal': '金型体质',
        'water': '水型体质'
    };
    const element = params.get('element') || 'earth';
    const constitutionType = elementMap[element] || '土型体质';

    const typeEl = document.getElementById('constitution-type');
    if (typeEl) typeEl.textContent = constitutionType;

    const shopLink = document.getElementById('dynamic-shop-link');
    if (shopLink) {
        shopLink.href = `shop.html?element=${element}`;
    }

    const dateEl = document.getElementById('report-date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
    }

    const CONSTITUTION_DATA = {
        '木型体质': {
            desc: '木型体质的人肝胆功能较强，性格果断有主见，但容易急躁易怒。春季是木型体质的旺季，需要注意疏肝理气。',
            traits: [
                '性格特征：果断有主见，行动力强',
                '易发问题：肝火旺盛，失眠多梦',
                '体型特征：身材修长，面色偏青'
            ],
            tips: [
                '多食绿色蔬菜，如芹菜、菠菜',
                '保持心情舒畅，避免郁怒',
                '推荐运动：八段锦、慢跑'
            ],
            radarData: [85, 45, 60, 50, 40],
            radarColor: '#2d6a4f',
            dietGood: '菠菜、枸杞、山药、绿豆、芹菜、菊花',
            dietBad: '辣椒、油炸食品、烈酒、羊肉',
            dietPlan: [
                { day: '周一', meals: ['芹菜百合粥 + 全麦包', '清炒西兰花 + 凉拌木耳', '菠菜猪肝汤 + 糙米饭'] },
                { day: '周二', meals: ['绿豆面条 + 荷包蛋', '青椒炒肉丝 + 蒸山药', '菊花决明子茶 + 拌海带'] },
                { day: '周三', meals: ['玉米面粥 + 拌菠菜', '韭菜炒鸡蛋 + 紫菜汤', '素炒西葫芦 + 燕麦饭'] },
                { day: '周四', meals: ['山药小米粥 + 枸杞叶', '清蒸鲈鱼 + 炒空心菜', '绿豆百合汤 + 馒头'] },
                { day: '周五', meals: ['全麦面包 + 绿茶', '木须肉 + 凉拌黄瓜', '银耳莲子羹 + 炒白菜'] },
                { day: '周六', meals: ['燕麦粥 + 拌苦瓜', '香菇炖鸡 + 炒青菜', '芹菜拌腐竹 + 杂粮饭'] },
                { day: '周日', meals: ['黑豆浆 + 蔬菜沙拉', '番茄炒蛋 + 菠菜汤', '山药炒木耳 + 小米饭'] }
            ],
            exercise: {
                recommend: '八段锦、太极拳、慢跑、郊外踏青',
                frequency: '每周 4-5 次，每次 40 分钟',
                notice: '木型人易急躁，运动应以舒缓、放松身心为主，避免过度竞技类运动，运动后注意拉伸。'
            },
            seasonal: {
                focus: '春季养肝（疏肝理气，平息肝火）',
                acupoints: '太冲穴（平肝息风）、期门穴（疏肝理气）、三阴交',
                tea: '玫瑰菊花茶、决明子绿茶、枸杞叶茶'
            }
        },
        '火型体质': {
            desc: '火型体质的人心脏功能活跃，性格热情开朗，但容易心烦气躁。夏季需格外注意养心安神。',
            traits: [
                '性格特征：热情开朗，善于表达',
                '易发问题：心烦失眠，口舌生疮',
                '体型特征：面色红润，手脚温热'
            ],
            tips: [
                '多食苦味食物，如苦瓜、莲子',
                '避免过度兴奋和熬夜',
                '推荐运动：游泳、瑜伽'
            ],
            radarData: [40, 85, 50, 45, 60],
            radarColor: '#c9184a',
            dietGood: '苦瓜、莲子、百合、西瓜、绿豆、赤小豆',
            dietBad: '羊肉、桂圆、煎烤食品、辛辣刺激',
            dietPlan: [
                { day: '周一', meals: ['百合莲子粥 + 水煮蛋', '苦瓜炒肉片 + 冬瓜汤', '凉拌穿心莲 + 杂粮粥'] },
                { day: '周二', meals: ['绿豆豆浆 + 全麦吐司', '西红柿炒蛋 + 凉拌黄瓜', '鸭肉冬瓜汤 + 糙米饭'] },
                { day: '周三', meals: ['燕麦片 + 苹果', '清蒸鲤鱼 + 炒空心菜', '莲子百合汤 + 馒头'] },
                { day: '周四', meals: ['赤小豆薏米粥 + 菜包', '芹菜拌香干 + 紫菜蛋花汤', '凉拌苦菊 + 小米粥'] },
                { day: '周五', meals: ['豆腐脑 + 蔬菜饼', '木须肉 + 拌海带丝', '冬瓜排骨汤 + 燕麦饭'] },
                { day: '周六', meals: ['牛奶 + 燕麦', '清炒苦瓜 + 蘑菇汤', '银耳莲子羹 + 蒸红薯'] },
                { day: '周日', meals: ['杂粮粥 + 煮鸡蛋', '清蒸鲈鱼 + 拌菠菜', '绿豆汤 + 凉拌黄瓜'] }
            ],
            exercise: {
                recommend: '游泳、瑜伽、散步、慢骑行',
                frequency: '每周 3-4 次，每次 30-45 分钟',
                notice: '火型人夏季出汗多，运动宜在早晚清凉时进行，避免大汗淋漓伤阴耗气，运动后及时补充水分。'
            },
            seasonal: {
                focus: '夏季养心（清心降火，宁心安神）',
                acupoints: '神门穴（宁心安神）、少府穴（清心泻火）、内关穴',
                tea: '莲子心茶、金银花麦冬茶、菊花薄荷茶'
            }
        },
        '土型体质': {
            desc: '土型体质的人脾胃功能较为突出，性格沉稳踏实，做事有条理。但容易受湿气影响，需要注意健脾祛湿。',
            traits: [
                '消化能力：较强，但易受湿气影响',
                '情绪特征：温和稳重，但容易多思',
                '体型特征：肌肉丰满，四肢温暖'
            ],
            tips: [
                '饮食宜温热，忌生冷寒凉',
                '保持规律作息，避免过度思虑',
                '适量运动，推荐散步和太极'
            ],
            radarData: [50, 40, 85, 60, 45],
            radarColor: '#e6a817',
            dietGood: '山药、薏米、陈皮、茯苓、南瓜、小米',
            dietBad: '冷饮、甜腻食品、海鲜、肥甘厚味',
            dietPlan: [
                { day: '周一', meals: ['山药小米粥 + 红枣桂圆', '黄芪炖鸡 + 莲子薏仁汤', '清蒸鲈鱼 + 茯苓山药汤'] },
                { day: '周二', meals: ['南瓜红枣羹 + 全麦吐司', '党参炖排骨 + 白术陈皮', '素炒山药 + 燕麦饭'] },
                { day: '周三', meals: ['薏米红豆粥 + 煮鸡蛋', '清炒包菜 + 鲫鱼豆腐汤', '小米粥 + 炒小白菜'] },
                { day: '周四', meals: ['陈皮白粥 + 菜包', '土豆烧牛肉 + 菠菜汤', '莲子百合汤 + 蒸红薯'] },
                { day: '周五', meals: ['黑豆豆浆 + 玉米饼', '香菇炒肉片 + 冬瓜海带', '红薯粥 + 凉拌黄瓜'] },
                { day: '周六', meals: ['小米南瓜粥 + 煎蛋', '白切鸡 + 炒油麦菜', '茯苓薏米汤 + 杂粮饭'] },
                { day: '周日', meals: ['燕麦粥 + 坚果', '山药炒木耳 + 紫菜汤', '陈皮瘦肉粥 + 拌生菜'] }
            ],
            exercise: {
                recommend: '太极、五禽戏、散步、慢跑',
                frequency: '每周 4-5 次，每次 40-50 分钟',
                notice: '土型人易生湿困重，需坚持规律运动以健运脾胃，忌饭后立即剧烈运动，推荐饭后百步走。'
            },
            seasonal: {
                focus: '长夏养脾（健脾祛湿，芳香化浊）',
                acupoints: '足三里（健脾和胃）、中脘穴（理气和胃）、丰隆穴（祛湿化痰）',
                tea: '陈皮茯苓茶、红豆薏米茶、藿香佩兰茶'
            }
        },
        '金型体质': {
            desc: '金型体质的人肺部功能突出，性格内敛沉稳，注重细节。秋季需注意润肺养阴，防止干燥。',
            traits: [
                '性格特征：沉稳内敛，做事严谨',
                '易发问题：皮肤干燥，呼吸道敏感',
                '体型特征：皮肤白皙，骨骼匀称'
            ],
            tips: [
                '多食白色食物，如梨、百合、银耳',
                '保持室内湿度，避免干燥环境',
                '推荐运动：深呼吸、登山'
            ],
            radarData: [45, 50, 60, 85, 40],
            radarColor: '#6c757d',
            dietGood: '雪梨、百合、白萝卜、银耳、山药、蜂蜜',
            dietBad: '辣椒、生葱、生蒜、过度烘烤',
            dietPlan: [
                { day: '周一', meals: ['百合银耳羹 + 鸡蛋', '白萝卜炖排骨 + 炒青菜', '梨汁燕麦粥 + 馒头'] },
                { day: '周二', meals: ['山药小米粥 + 豆浆', '清炒百合芹菜 + 豆腐汤', '莲子百合粥 + 炒白菜'] },
                { day: '周三', meals: ['蜂蜜水 + 全麦包', '香菇蒸鸡 + 冬瓜汤', '白萝卜丝饼 + 小米粥'] },
                { day: '周四', meals: ['牛奶 + 燕麦', '清蒸白鱼 + 炒西兰花', '银耳莲子羹 + 蒸红薯'] },
                { day: '周五', meals: ['百合南瓜粥 + 煎蛋', '山药炒木耳 + 菠菜汤', '雪梨炖瘦肉 + 糙米饭'] },
                { day: '周六', meals: ['豆浆 + 素包子', '白萝卜烧肉 + 海带汤', '百合红枣粥 + 拌黄瓜'] },
                { day: '周日', meals: ['燕麦粥 + 苹果', '清蒸鲈鱼 + 炒油麦菜', '银耳雪梨汤 + 杂粮饭'] }
            ],
            exercise: {
                recommend: '慢跑、登山、扩胸运动、呼吸操',
                frequency: '每周 3-5 次，每次 40 分钟',
                notice: '金型人秋季易受燥邪，运动宜在空气清新处进行，配合深呼吸（腹式呼吸）以增强肺活量，防寒保暖。'
            },
            seasonal: {
                focus: '秋季养肺（滋阴润燥，养肺护肤）',
                acupoints: '太渊穴（补肺气）、迎香穴（通鼻窍）、肺俞穴',
                tea: '麦冬百合茶、胖大海桔梗茶、银耳雪梨茶'
            }
        },
        '水型体质': {
            desc: '水型体质的人肾脏功能较强，性格沉静有智慧，但容易畏寒怕冷。冬季需要注意固肾保暖。',
            traits: [
                '性格特征：沉静睿智，思虑深远',
                '易发问题：腰膝酸软，怕冷易倦',
                '体型特征：面色偏暗，下肢易水肿'
            ],
            tips: [
                '多食黑色食物，如黑芝麻、黑豆',
                '注意保暖，避免寒冷刺激',
                '推荐运动：站桩、太极'
            ],
            radarData: [60, 45, 40, 50, 85],
            radarColor: '#1a237e',
            dietGood: '黑芝麻、黑豆、核桃、桑葚、羊肉、韭菜',
            dietBad: '生冷瓜果、寒凉海鲜、冷饮',
            dietPlan: [
                { day: '周一', meals: ['黑芝麻糊 + 水煮蛋', '当归羊肉汤 + 炒菠菜', '核桃黑豆豆浆 + 糙米饭'] },
                { day: '周二', meals: ['核桃燕麦粥 + 全麦包', '韭菜炒鸡蛋 + 紫菜汤', '黑米粥 + 蒸红薯'] },
                { day: '周三', meals: ['黑米糕 + 牛奶', '清蒸海鱼 + 炒空心菜', '桑葚红枣粥 + 馒头'] },
                { day: '周四', meals: ['黑豆豆浆 + 菜包', '板栗炖鸡 + 冬瓜汤', '黑芝麻核桃粥 + 炒白菜'] },
                { day: '周五', meals: ['小米桂圆粥 + 煎蛋', '羊肉烧土豆 + 拌海带', '黑米紫薯粥 + 杂粮饭'] },
                { day: '周六', meals: ['桑葚麦片粥 + 坚果', '韭菜炒肉丝 + 蘑菇汤', '黑芝麻汤圆 + 蒸南瓜'] },
                { day: '周日', meals: ['黑米粥 + 煮鸡蛋', '清蒸鲈鱼 + 炒油麦菜', '核桃百合汤 + 拌黄瓜'] }
            ],
            exercise: {
                recommend: '太极拳、站桩、慢走、温和瑜伽',
                frequency: '每周 3-4 次，每次 30-40 分钟',
                notice: '水型人冬季易受寒，运动不宜大汗，以身体微微发热为宜。注重腰部保暖，可多做搓腰、暖肾的动作。'
            },
            seasonal: {
                focus: '冬季养肾（温阳固肾，防寒保暖）',
                acupoints: '涌泉穴（引火归元）、肾俞穴（温补肾阳）、关元穴',
                tea: '黑芝麻核桃饮、枸杞桑葚茶、桂圆红枣茶'
            }
        }
    };

    const data = CONSTITUTION_DATA[constitutionType];
    if (data) {
        const descEl = document.getElementById('constitution-desc');
        if (descEl) descEl.textContent = data.desc;

        const traitsEl = document.getElementById('core-traits');
        if (traitsEl) {
            traitsEl.innerHTML = data.traits.map(t => '<li>' + t + '</li>').join('');
        }

        const tipsEl = document.getElementById('general-tips');
        if (tipsEl) {
            tipsEl.innerHTML = data.tips.map(t => '<li>' + t + '</li>').join('');
        }

        const dietLightsEl = document.getElementById('diet-lights');
        if (dietLightsEl) {
            dietLightsEl.innerHTML = `
                <div class="diet-row">
                    <div class="diet-col good">
                        <h4>🟢 宜吃</h4>
                        <p>${data.dietGood}</p>
                    </div>
                    <div class="diet-col bad">
                        <h4>🔴 忌吃</h4>
                        <p>${data.dietBad}</p>
                    </div>
                </div>
            `;
        }
        
        // 渲染 7天食谱
        const dietPlanEl = document.getElementById('diet-plan-container');
        if (dietPlanEl && data.dietPlan) {
            let planHtml = '<div class="diet-plan-grid">';
            data.dietPlan.forEach(dayPlan => {
                planHtml += `
                    <div class="diet-day-card">
                        <div class="diet-day-title">${dayPlan.day}</div>
                        <ul class="diet-meals">
                            <li><span class="meal-label">早餐</span> ${dayPlan.meals[0]}</li>
                            <li><span class="meal-label">午餐</span> ${dayPlan.meals[1]}</li>
                            <li><span class="meal-label">晚餐</span> ${dayPlan.meals[2]}</li>
                        </ul>
                    </div>
                `;
            });
            planHtml += '</div>';
            dietPlanEl.innerHTML = planHtml;
        }

        // 渲染运动建议
        const exerciseEl = document.getElementById('exercise-plan-container');
        if (exerciseEl && data.exercise) {
            exerciseEl.innerHTML = `
                <div class="info-card">
                    <p><strong>推荐运动：</strong>${data.exercise.recommend}</p>
                    <p><strong>每周频率：</strong>${data.exercise.frequency}</p>
                    <p><strong>注意事项：</strong>${data.exercise.notice}</p>
                </div>
            `;
        }

        // 渲染季节重点
        const seasonalEl = document.getElementById('seasonal-plan-container');
        if (seasonalEl && data.seasonal) {
            seasonalEl.innerHTML = `
                <div class="info-card">
                    <p><strong>当前重点：</strong><span style="color:var(--accent-green);">[ ${data.seasonal.focus} ]</span></p>
                    <p><strong>穴位推荐：</strong>${data.seasonal.acupoints}</p>
                    <p><strong>茶饮推荐：</strong>${data.seasonal.tea}</p>
                </div>
            `;
        }

        const ctx = document.getElementById('radarChart');
        if (ctx && window.Chart) {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['木·肝', '火·心', '土·脾', '金·肺', '水·肾'],
                    datasets: [{
                        label: '你的五行指数',
                        data: data.radarData,
                        backgroundColor: data.radarColor + '33', 
                        borderColor: data.radarColor,
                        pointBackgroundColor: data.radarColor,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: data.radarColor
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12 } },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: 'rgba(255, 255, 255, 0.9)' }
                        }
                    }
                }
            });
        }
    }

})();
"""
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)


# Append CSS
with open(css_path, 'a', encoding='utf-8') as f:
    f.write('''
/* --- Dynamic Diet & Exercise Cards --- */
.diet-plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.diet-day-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.diet-day-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 210, 173, 0.1);
    border-color: rgba(0, 210, 173, 0.3);
}

.diet-day-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-green, #00d2ad);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.diet-meals {
    list-style: none;
    padding: 0;
    margin: 0;
}

.diet-meals li {
    font-size: 0.9rem;
    margin-bottom: 8px;
    color: var(--text-primary);
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
}

.meal-label {
    background: rgba(0, 210, 173, 0.15);
    color: var(--accent-green, #00d2ad);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    flex-shrink: 0;
}

.info-card {
    background: rgba(255,255,255,0.03);
    border-left: 4px solid var(--accent-green, #00d2ad);
    padding: 16px;
    border-radius: 0 12px 12px 0;
    margin-top: 16px;
}

.info-card p {
    margin-bottom: 10px;
    line-height: 1.6;
    font-size: 0.95rem;
}

.info-card p:last-child {
    margin-bottom: 0;
}

.info-card strong {
    color: rgba(255,255,255,0.9);
}
''')

print("Scripts and HTML updated successfully.")
