/**
 * bank_tasks_data.js
 * Единый банк задач НЕшколы.
 * Содержит структурированный каталог тем, интерактивные задачи и тестирования по физике.
 * Используется в bank_tasks.html и tasks_catalog.html для решения задач прямо на месте.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BankTasksData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOPICS = [
  {
    "id": "math-multiplication",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Задачи на умножение",
    "class": "4",
    "level": "easy",
    "description": "Текстовые задачи на умножение и вычисления в мире блоков.",
    "tasks": [
      {
        "id": "math-mult-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Алекс построил забор из деревянных блоков. В каждом ряду 8 блоков, а всего 6 рядов. Сколько всего блоков понадобилось Алексу для забора?\r\n        </p>",
        "answer": "48",
        "image": "assets/images/task1_alex_placing_block.png"
      },
      {
        "id": "math-mult-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Стив решил сделать дорожку из булыжника длиной 12 блоков и шириной 3 блока. Сколько всего блоков булыжника потребуется для дорожки?\r\n        </p>",
        "answer": "36",
        "image": "assets/images/task2_steve_placing_cobble.png"
      },
      {
        "id": "math-mult-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Чтобы скрафтить 1 книжную полку, нужно 3 книги. Стив хочет поставить в своей библиотеке 7 полок. Сколько книг ему потребуется?\r\n        </p>",
        "answer": "21",
        "image": "assets/images/task3_steve_placing_bookshelf.jpg"
      },
      {
        "id": "math-mult-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            В сундуке лежит 9 стаков досок. В одном стаке - 64 доски. Сколько досок всего в сундуке? \r\n        </p>",
        "answer": "576",
        "image": "assets/animations/task4_chest_with_planks.gif"
      },
      {
        "id": "math-mult-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Для создания одной лодки нужно 5 досок. Стив и Алекс хотят построить по 3 лодки каждый. Сколько досок им нужно на все лодки?\r\n        </p>",
        "answer": "30",
        "image": "assets/images/task5_boats.jpg"
      },
      {
        "id": "math-mult-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Чтобы вырастить пшеницу, Стив сделал грядку размером 4 блока в длину и 5 блоков в ширину. Сколько семян пшеницы ему нужно, чтобы засеять всю грядку?\r\n        </p>",
        "answer": "20",
        "image": "assets/animations/task6_wheat.gif"
      },
      {
        "id": "math-mult-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            В одном ведре 1 литр воды. Стиву нужно наполнить бассейн объёмом 15 литров. Сколько вёдер воды ему понадобится?\r\n        </p>",
        "answer": "15",
        "image": "assets/animations/task7_water.gif"
      },
      {
        "id": "math-mult-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Для постройки башни Стив использует каменные кирпичи. В одной стене башни 7 рядов по 6 кирпичей в каждом. Сколько кирпичей в одной стене?\r\n        </p>",
        "answer": "42",
        "image": "assets/animations/task8_tower.gif"
      },
      {
        "id": "math-mult-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет построить стеклянную крышу размером 9 блоков в длину и 4 блока в ширину. Сколько стеклянных блоков ей потребуется?\r\n        </p>",
        "answer": "36",
        "image": "assets/animations/task9_glass.gif"
      },
      {
        "id": "math-mult-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Чтобы скрафтить 1 золотое яблоко, нужно 8 золотых слитков. Стив хочет сделать 5 золотых яблок. Сколько слитков золота ему потребуется?\r\n        </p>",
        "answer": "40",
        "image": "assets/animations/task10_golden_apple.gif"
      },
      {
        "id": "math-mult-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">\r\n            Алекс выращивает морковь. Она посадила 5 грядок по 8 морковок в каждой. Сколько всего морковок вырастет у Алекс?\r\n        </p>",
        "answer": "40",
        "image": "assets/images/task11_alex_carrots.png"
      },
      {
        "id": "math-mult-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\r\n            Для постройки портала в Нижний мир нужно 14 обсидиановых блоков. Сколько блоков потребуется, если Стив хочет построить 3 портала для друзей?\r\n        </p>",
        "answer": "42",
        "image": "assets/images/task12_nether_portal.png"
      },
      {
        "id": "math-mult-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">\r\n            В одном сундуке помещается 27 предметов, а в одной бочке помещается 20 предметов. Сколько предметов поместится в 4 сундуках и 2 бочках?\r\n        </p>",
        "answer": "148",
        "image": "assets/images/task13_chests_barrels.png"
      },
      {
        "id": "math-mult-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\r\n            Чтобы скрафтить 1 кровать, нужно 3 доски и 3 блока шерсти. Сколько досок и шерсти потребуется для 6 кроватей?\r\n        </p>",
        "answer": "36",
        "image": "assets/images/task14_bed_crafting.png"
      },
      {
        "id": "math-mult-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">\r\n            Алекс делает лестницу из дуба. На одну лестницу уходит 6 досок. Сколько досок потребуется для 8 лестниц?\r\n        </p>",
        "answer": "48",
        "image": "assets/images/task15_oak_stairs.png"
      },
      {
        "id": "math-mult-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\r\n            Стив выложил пол из шерсти размером 6 блоков в длину, 5 в ширину и 2 блока в толщину. Сколько блоков шерсти ему понадобилось?\r\n        </p>",
        "answer": "60",
        "image": "assets/images/task16_wool_floor.png"
      },
      {
        "id": "math-mult-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">\r\n            Для постройки моста нужно 10 столбов, в каждом по 4 блока каменных кирпичей. Сколько блоков потребуется для всех столбов?\r\n        </p>",
        "answer": "40",
        "image": "assets/images/task17_bridge_pillars.png"
      },
      {
        "id": "math-mult-18",
        "num": 18,
        "title": "Задача 18",
        "text": "<p class=\"task-text\">\r\n            Чтобы скрафтить 1 ведро, нужно 3 железных слитка, а для ножниц нужно 2 железных слитка. Сколько слитков потребуется для 5 вёдер и 2 ножниц?\r\n        </p>",
        "answer": "19",
        "image": "assets/images/task18_bucket_shears.png"
      },
      {
        "id": "math-mult-19",
        "num": 19,
        "title": "Задача 19",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет построить стеклянную стену высотой 4 блока и длиной 11 блоков. Сколько стеклянных блоков ей потребуется?\r\n        </p>",
        "answer": "44",
        "image": "assets/images/task19_glass_wall.png"
      },
      {
        "id": "math-mult-20",
        "num": 20,
        "title": "Задача 20",
        "text": "<p class=\"task-text\">\r\n            Стив нашёл 6 стаков угля, в каждом стаке по 64 угля. Сколько всего угля у Стива?\r\n        </p>",
        "answer": "384",
        "image": "assets/images/task20_coal_stacks.png"
      },
      {
        "id": "math-mult-21",
        "num": 21,
        "title": "Задача 21",
        "text": "<p class=\"task-text\">\r\n            Для создания 1 карты нужно 8 листов бумаги. Сколько листов потребуется для 7 карт?\r\n        </p>",
        "answer": "56",
        "image": "assets/images/task21_map_crafting.png"
      },
      {
        "id": "math-mult-22",
        "num": 22,
        "title": "Задача 22",
        "text": "<p class=\"task-text\">\r\n            Алекс построила дорожку из песчаника длиной 15 блоков и шириной 2 блока. Сколько блоков песчаника ушло на дорожку?\r\n        </p>",
        "answer": "30",
        "image": "assets/images/task22_sandstone_path.png"
      },
      {
        "id": "math-mult-23",
        "num": 23,
        "title": "Задача 23",
        "text": "<p class=\"task-text\">\r\n            Стив хочет скрафтить 12 лодок, если на каждую нужно 5 досок. Сколько всего досок потребуется?\r\n        </p>",
        "answer": "60",
        "image": "assets/images/task23_boat_crafting.png"
      },
      {
        "id": "math-mult-24",
        "num": 24,
        "title": "Задача 24",
        "text": "<p class=\"task-text\">\r\n            Чтобы сделать забор вокруг огорода размером 8 на 6 блоков, сколько блоков забора потребуется (учти, что забор идёт по периметру)?\r\n        </p>",
        "answer": "28",
        "image": "assets/images/task24_garden_fence.png"
      },
      {
        "id": "math-mult-25",
        "num": 25,
        "title": "Задача 25",
        "text": "<p class=\"task-text\">\r\n            В одной печи можно переплавить 8 предметов за 1 уголь. Сколько угля потребуется, чтобы переплавить 56 предметов?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task25_furnace_smelting.png"
      },
      {
        "id": "math-mult-26",
        "num": 26,
        "title": "Задача 26",
        "text": "<p class=\"task-text\">\r\n            Алекс посадила 3 ряда арбузов, в каждом ряду по 9 арбузов. Сколько всего арбузов?\r\n        </p>",
        "answer": "27",
        "image": "assets/images/task26_melon_farm.png"
      },
      {
        "id": "math-mult-27",
        "num": 27,
        "title": "Задача 27",
        "text": "<p class=\"task-text\">\r\n            Стив построил башню из 10 этажей, на каждом этаже по 12 блоков. Сколько блоков в башне?\r\n        </p>",
        "answer": "120",
        "image": "assets/images/task27_tower.png"
      },
      {
        "id": "math-mult-28",
        "num": 28,
        "title": "Задача 28",
        "text": "<p class=\"task-text\">\r\n            Для крафта 1 рамки нужно 8 палок. Сколько палок потребуется для 9 рамок?\r\n        </p>",
        "answer": "72",
        "image": "assets/images/task28_item_frame.png"
      },
      {
        "id": "math-mult-29",
        "num": 29,
        "title": "Задача 29",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет сделать 4 набора инструментов, в каждом наборе по 5 предметов. Сколько всего инструментов нужно сделать?\r\n        </p>",
        "answer": "20",
        "image": "assets/images/task29_tool_sets.png"
      },
      {
        "id": "math-mult-30",
        "num": 30,
        "title": "Задача 30",
        "text": "<p class=\"task-text\">\r\n            Стив построил мост длиной 20 блоков и шириной 3 блока. Сколько блоков ушло на мост?\r\n        </p>",
        "answer": "60",
        "image": "assets/images/task30_bridge.png"
      },
      {
        "id": "math-mult-31",
        "num": 31,
        "title": "Задача 31",
        "text": "<p class=\"task-text\">\r\n            Для постройки ограды вокруг поля размером 10 на 4 блока, сколько блоков ограды потребуется (по периметру)?\r\n        </p>",
        "answer": "72",
        "image": "assets/images/task32_block_stacks.png"
      },
      {
        "id": "math-mult-32",
        "num": 32,
        "title": "Задача 32",
        "text": "<p class=\"task-text\">\r\n            В одном стаке 64 блока. Сколько всего блоков в 7 стаках?\r\n        </p>",
        "answer": "448",
        "image": "assets/images/task32_block_stacks.png"
      },
      {
        "id": "math-mult-33",
        "num": 33,
        "title": "Задача 33",
        "text": "<p class=\"task-text\">\r\n            Чтобы скрафтить 1 сундук, нужно 8 досок. Сколько досок потребуется для 6 сундуков?\r\n        </p>",
        "answer": "48",
        "image": "assets/images/task33_chest_crafting.png"
      },
      {
        "id": "math-mult-34",
        "num": 34,
        "title": "Задача 34",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет построить лестницу на 12 ступеней, если на каждую ступень нужно 2 блока. Сколько блоков потребуется?\r\n        </p>",
        "answer": "24",
        "image": "assets/images/task32_block_stacks.png"
      },
      {
        "id": "math-mult-35",
        "num": 35,
        "title": "Задача 35",
        "text": "<p class=\"task-text\">\r\n            Друзья на сервере крафтил каждому по алмазному мечу. Всего было 3 человека, кому понадобился меч. Сколько понадобилось алмазов для крафта (в крафте меча используется два алмаза)?\r\n        </p>",
        "answer": "6",
        "image": "assets/images/task35_diamond_sword.png"
      },
      {
        "id": "math-mult-36",
        "num": 36,
        "title": "Задача 36",
        "text": "<p class=\"task-text\">\r\n            Для того чтобы приготовить тортик нужно использовать одно ведро молока. Сколько вёдер молока понадобиться, чтобы приготовить 5 тортиков?\r\n        </p>",
        "answer": "5",
        "image": "assets/images/task36_cake.png"
      },
      {
        "id": "math-mult-37",
        "num": 37,
        "title": "Задача 37",
        "text": "<p class=\"task-text\">\r\n            На дружелюбного гаста может сесть всего 4 человека, но Стиву этого мало, поэтому он решил усовершенствовать механизм седла и увеличить допустимое количество человек в три раза. Сколько теперь человек может расположиться на дружелюбном гасте?\r\n        </p>",
        "answer": "12",
        "image": "assets/images/task37_ghast_saddle.png"
      },
      {
        "id": "math-mult-38",
        "num": 38,
        "title": "Задача 38",
        "text": "<p class=\"task-text\">\r\n            Стив построил прямоугольный бассейн длиной 6 метров, шириной 3 метра и глубиной 2 метра. Сколько литров воды потребуется, чтобы полностью его наполнить, если в 1 кубическом метре – 1000 литров воды?  \r\n        </p>",
        "answer": "3600",
        "image": "assets/animations/task1_alex_placing_block.gif"
      },
      {
        "id": "math-mult-39",
        "num": 39,
        "title": "Задача 39",
        "text": "<p class=\"task-text\">\r\n            Алекс посадила 4 ряда картофеля по 7 кустов в каждом. С каждого куста она собрала по 3 килограмма картофеля. Сколько килограммов картофеля собрала Алекс?    \r\n        </p>",
        "answer": "84",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-40",
        "num": 40,
        "title": "Задача 40",
        "text": "<p class=\"task-text\">\r\n            Стив построил дорожку длиной 15 метров из блоков, где каждый блок – 1 метр. Если ширина дорожки 2 метра, сколько блоков всего понадобилось?  \r\n        </p>",
        "answer": "30",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-41",
        "num": 41,
        "title": "Задача 41",
        "text": "<p class=\"task-text\">\r\n            Для постройки башни Стив использовал 12 этажей по 8 блоков в каждом. Если масса одного блока – 2 килограмма, какова масса всей башни?  \r\n        </p>",
        "answer": "192",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-42",
        "num": 42,
        "title": "Задача 42",
        "text": "<p class=\"task-text\">\r\n            Алекс наполнила 5 вёдер водой, в каждом ведре по 10 литров. Она вылила всю воду в чан объёмом 60 литров. Сколько литров воды осталось до полного наполнения чана?  \r\n        </p>",
        "answer": "10",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-43",
        "num": 43,
        "title": "Задача 43",
        "text": "<p class=\"task-text\">\r\n            Чтобы построить забор вокруг огорода размером 10 на 6 метров, Стив использовал по 1 блоку на каждый метр. Сколько блоков понадобилось для всего забора, если забор идёт по периметру?  \r\n        </p>",
        "answer": "32",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-44",
        "num": 44,
        "title": "Задача 44",
        "text": "<p class=\"task-text\">\r\n            Стив собрал 4 стака железной руды, в каждом стаке по 64 блока. Из 2 блоков руды получается 1 слиток. Сколько слитков железа получит Стив?  \r\n        </p>",
        "answer": "128",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-45",
        "num": 45,
        "title": "Задача 45",
        "text": "<p class=\"task-text\">\r\n            Алекс построила мост длиной 20 метров и шириной 3 метра. Если на каждый квадратный метр уходит 5 досок, сколько досок всего потребуется?   \r\n        </p>",
        "answer": "30",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-46",
        "num": 46,
        "title": "Задача 46",
        "text": "<p class=\"task-text\">\r\n            Стив скрафтил 6 лодок, каждая из которых весит 8 килограммов. Он перевёз их на расстояние 3 километра. Сколько метров он прошёл?  \r\n        </p>",
        "answer": "144",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-47",
        "num": 47,
        "title": "Задача 47",
        "text": "<p class=\"task-text\">\r\n            Чтобы построить стеклянную крышу размером 8 на 5 метров, Алекс использовала блоки размером 1 на 1 метр. Если масса одного стеклянного блока – 3 килограмма, какова масса всей крыши?  \r\n        </p>",
        "answer": "120",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      },
      {
        "id": "math-mult-48",
        "num": 48,
        "title": "Задача 48",
        "text": "<p class=\"task-text\">\r\n            Стив посадил 5 рядов моркови по 9 кустов. С каждого куста он собрал по 4 морковки. Сколько всего морковок собрал Стив?   \r\n        </p>",
        "answer": "180",
        "image": "assets/images/m_task1_alex_steve_pool.png"
      }
    ]
  },
  {
    "id": "math-cost",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Задачи на формулу стоимости",
    "class": "4",
    "level": "medium",
    "description": "Рассчитывай стоимость, цену и количество покупок.",
    "tasks": [
      {
        "id": "math-cost-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Стив хочет купить 5 алмазных мечей. Один меч стоит 20 изумрудов. Сколько изумрудов нужно Стиву?\r\n        </p>",
        "answer": "100",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Алекс продаёт 3 стака дерева по цене 12 железных слитков за стак. Сколько железных слитков она получит за все дерево?\r\n        </p>",
        "answer": "36",
        "image": "assets/images/task2_steve_placing_cobble.png"
      },
      {
        "id": "math-cost-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Житель предлагает обмен: 1 книжная полка за 6 изумрудов. Сколько изумрудов нужно, чтобы купить 7 книжных полок?\r\n        </p>",
        "answer": "42",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Стив купил 10 золотых яблок. Одно яблоко стоит 5 алмазов. Сколько алмазов он потратил?\r\n        </p>",
        "answer": "50",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет купить 8 ведер лавы. Одно ведро стоит 4 железных слитка. Сколько всего железных слитков потребуется?\r\n        </p>",
        "answer": "32",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Житель продаёт 15 стрел по цене 2 изумруда за 5 стрел. Сколько изумрудов нужно, чтобы купить все стрелы?\r\n        </p>",
        "answer": "10",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Стив купил 6 книг, каждая стоит 3 изумруда. Сколько изумрудов он потратил?\r\n        </p>",
        "answer": "18",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Алекс хочет купить 4 алмазных кирки. Одна кирка стоит 18 изумрудов. Сколько изумрудов потребуется?\r\n        </p>",
        "answer": "72",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-cost-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Библиотекарь в деревне продаёт зачарованные книги. Одна книга стоит 12 изумрудов. Сколько изумрудов нужно Стиву, чтобы купить 4 зачарованные книги?\r\n        </p>",
        "answer": "48",
        "image": "assets/images/task9_librarian.png"
      },
      {
        "id": "math-cost-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Фермер продаёт тыквы по 2 изумруда за штуку и арбузы по 3 изумруда. Стив хочет купить 8 тыкв и 4 арбуза. Сколько всего изумрудов ему понадобится?\r\n        </p>",
        "answer": "28",
        "image": "assets/images/task10_farmer.png"
      },
      {
        "id": "math-cost-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">\r\n            Кузнец продаёт алмазную кирку за 15 изумрудов, алмазный меч за 20 изумрудов и алмазную лопату за 10 изумрудов. Сколько изумрудов нужно Алекс, чтобы купить кирку и лопату?\r\n        </p>",
        "answer": "25",
        "image": "assets/images/task11_blacksmith.png"
      },
      {
        "id": "math-cost-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\r\n            Лучник продаёт лук за 20 изумрудов и колчан стрел за 8 изумрудов. Алекс хочет купить один лук и четыре колчана стрел. Сколько изумрудов ему понадобится?\r\n        </p>",
        "answer": "52",
        "image": "assets/images/task12_fletcher.png"
      },
      {
        "id": "math-cost-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">\r\n            Бронник продаёт железный нагрудник за 25 изумрудов, железные ботинки за 15 изумрудов и железный шлем за 35 изумрудов. Сколько изумрудов нужно Стиву, чтобы купить нагрудник и шлем?\r\n        </p>",
        "answer": "75",
        "image": "assets/images/task13_armorer.png"
      },
      {
        "id": "math-cost-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\r\n            Картограф продаёт карту сокровищ за 12 изумрудов и компас за 6 изумрудов. Стив хочет купить 3 карты сокровищ и 1 компас. Сколько изумрудов ему понадобится?\r\n        </p>",
        "answer": "42",
        "image": "assets/images/task14_cartographer.png"
      },
      {
        "id": "math-cost-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">\r\n            Каменщик продаёт кварцевые блоки по 4 изумруда за штуку. Стиву нужно купить 16 блоков для постройки. Сколько изумрудов ему понадобится?\r\n        </p>",
        "answer": "64",
        "image": "assets/images/task15_mason.png"
      },
      {
        "id": "math-cost-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\r\n            Пастух продаёт красную шерсть за 5 изумрудов, синюю за 6 изумрудов и жёлтую за 4 изумруда. Алекс хочет купить 5 красной шерсти и 5 синей шерсти. Сколько изумрудов ей понадобится?\r\n        </p>",
        "answer": "55",
        "image": "assets/images/task16_shepherd.png"
      },
      {
        "id": "math-cost-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">\r\n            Священник продаёт зелье силы за 35 изумрудов и зелье регенерации за 25 изумрудов. Стив хочет купить одно зелье силы и два зелья регенерации. Сколько изумрудов ему понадобится?\r\n        </p>",
        "answer": "85",
        "image": "assets/images/task17_cleric.png"
      }
    ]
  },
  {
    "id": "math-way",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Задачи на формулу пути",
    "class": "4",
    "level": "easy",
    "description": "Находи путь, скорость и время движения (s = v · t).",
    "tasks": [
      {
        "id": "math-way-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Пешеход прошёл 12 км со скоростью 4 км/ч. Сколько времени он потратил на этот путь?</p>",
        "answer": "3",
        "unit": "ч"
      },
      {
        "id": "math-way-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Поезд ехал 4 часа со скоростью 65 км/ч. Какое расстояние преодолел поезд?</p>",
        "answer": "260",
        "unit": "км"
      },
      {
        "id": "math-way-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">Велосипедист проехал 48 км за 3 часа. С какой скоростью он двигался?</p>",
        "answer": "16",
        "unit": "км/ч"
      },
      {
        "id": "math-way-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">Автомобиль проехал 240 км за 3 часа. Сколько километров он проедет за 5 часов с той же постоянной скоростью?</p>",
        "answer": "400",
        "unit": "км"
      },
      {
        "id": "math-way-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">Стив проскакал на лошади 180 блоков за 6 секунд. Какова скорость лошади в блоках за секунду?</p>",
        "answer": "30",
        "unit": "блоков/с"
      },
      {
        "id": "math-way-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">Лодка плыла по реке 2 часа со скоростью 14 км/ч. Какой путь прошла лодка?</p>",
        "answer": "28",
        "unit": "км"
      },
      {
        "id": "math-way-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">Лыжник прошёл дистанцию 20 км со скоростью 10 км/ч. Сколько часов длилась лыжная гонка?</p>",
        "answer": "2",
        "unit": "ч"
      },
      {
        "id": "math-way-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">Самолёт летит со скоростью 800 км/ч. Какое расстояние он преодолеет за 30 минут (полчаса)?</p>",
        "answer": "400",
        "unit": "км"
      },
      {
        "id": "math-way-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">Мотоциклист проехал 150 км за 2 часа. Найдите среднюю скорость движения мотоциклиста.</p>",
        "answer": "75",
        "unit": "км/ч"
      },
      {
        "id": "math-way-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">Алекс бежала со скоростью 5 блоков в секунду в течение 24 секунд. Какое расстояние в блоках она пробежала?</p>",
        "answer": "120",
        "unit": "блоков"
      }
    ]
  },
  {
    "id": "math-expressions",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Решение выражений",
    "class": "4",
    "level": "hard",
    "description": "Практика вычислений, порядка действий и скобок.",
    "tasks": [
      {
        "id": "math-expr-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>2 × (500 - x ÷ 3) = 820\r\n        </p>",
        "answer": "270",
        "image": null
      },
      {
        "id": "math-expr-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>3 × (400 + x ÷ 4) = 1500\r\n        </p>",
        "answer": "400",
        "image": null
      },
      {
        "id": "math-expr-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>5 × (200 - x ÷ 2) = 350\r\n        </p>",
        "answer": "260",
        "image": null
      },
      {
        "id": "math-expr-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>4 × (300 + x ÷ 6) = 1400\r\n        </p>",
        "answer": "300",
        "image": null
      },
      {
        "id": "math-expr-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>6 × (150 - x ÷ 5) = 540\t\r\n        </p>",
        "answer": "300",
        "image": null
      },
      {
        "id": "math-expr-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>7 × (100 + x ÷ 7) = 854\r\n        </p>",
        "answer": "154",
        "image": null
      },
      {
        "id": "math-expr-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>8 × (250 - x ÷ 4) = 1200\r\n        </p>",
        "answer": "400",
        "image": null
      },
      {
        "id": "math-expr-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>9 × (180 + x ÷ 9) = 1719\r\n        </p>",
        "answer": "99",
        "image": null
      },
      {
        "id": "math-expr-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>10 × (90 - x ÷ 3) = 300\r\n        </p>",
        "answer": "180",
        "image": null
      },
      {
        "id": "math-expr-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Найди корень уравнения: <br>12 × (80 + x ÷ 8) = 1056\r\n        </p>",
        "answer": "64",
        "image": null
      },
      {
        "id": "math-expr-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>15 × (60 - x ÷ 5) = 525\n        </p>",
        "answer": "125",
        "image": null
      },
      {
        "id": "math-expr-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>18 × (50 + x ÷ 6) = 1152\n        </p>",
        "answer": "84",
        "image": null
      },
      {
        "id": "math-expr-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>20 × (40 - x ÷ 8) = 600\t\n        </p>",
        "answer": "80",
        "image": null
      },
      {
        "id": "math-expr-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>16 × (70 + x ÷ 4) = 1600\n        </p>",
        "answer": "120",
        "image": null
      },
      {
        "id": "math-expr-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>14 × (90 - x ÷ 7) = 1120\n        </p>",
        "answer": "70",
        "image": null
      },
      {
        "id": "math-expr-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>11 × (200 + x ÷ 11) = 2310\n        </p>",
        "answer": "110",
        "image": null
      },
      {
        "id": "math-expr-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>13 × (150 - x ÷ 13) = 1820\n        </p>",
        "answer": "130",
        "image": null
      },
      {
        "id": "math-expr-18",
        "num": 18,
        "title": "Задача 18",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>9 × (300 + x ÷ 3) = 3150\n        </p>",
        "answer": "150",
        "image": null
      },
      {
        "id": "math-expr-19",
        "num": 19,
        "title": "Задача 19",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>8 × (500 - x ÷ 2) = 2800\n        </p>",
        "answer": "300",
        "image": null
      },
      {
        "id": "math-expr-20",
        "num": 20,
        "title": "Задача 20",
        "text": "<p class=\"task-text\">\n            Найди корень уравнения: <br>6 × (400 + x ÷ 4) = 2760 \n        </p>",
        "answer": "240",
        "image": null
      },
      {
        "id": "math-expr-21",
        "num": 21,
        "title": "Задача 21",
        "text": "<p class=\"task-text\">\n            Вычисли значение выражения: (1 + 2) × 3 - 1\n        </p>",
        "answer": "3",
        "image": "assets/images/expressions_medium_task1.png"
      },
      {
        "id": "math-expr-22",
        "num": 22,
        "title": "Задача 22",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (2 + 2) × 3 - 2\n        </p>",
        "answer": "6",
        "image": "assets/images/expressions_medium_task2.png"
      },
      {
        "id": "math-expr-23",
        "num": 23,
        "title": "Задача 23",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (3 + 2) × 3 - 3\n        </p>",
        "answer": "9",
        "image": "assets/images/expressions_medium_task3.png"
      },
      {
        "id": "math-expr-24",
        "num": 24,
        "title": "Задача 24",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (4 + 2) × 3 - 4\n        </p>",
        "answer": "12",
        "image": "assets/images/expressions_medium_task4.png"
      },
      {
        "id": "math-expr-25",
        "num": 25,
        "title": "Задача 25",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (5 + 2) × 3 - 5\n        </p>",
        "answer": "15",
        "image": "assets/images/expressions_medium_task5.png"
      },
      {
        "id": "math-expr-26",
        "num": 26,
        "title": "Задача 26",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (6 + 2) × 3 - 6\n        </p>",
        "answer": "18",
        "image": "assets/images/expressions_medium_task6.png"
      },
      {
        "id": "math-expr-27",
        "num": 27,
        "title": "Задача 27",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (7 + 2) × 3 - 7\n        </p>",
        "answer": "21",
        "image": "assets/images/expressions_medium_task7.png"
      },
      {
        "id": "math-expr-28",
        "num": 28,
        "title": "Задача 28",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (8 + 2) × 3 - 8\n        </p>",
        "answer": "24",
        "image": "assets/images/expressions_medium_task8.png"
      },
      {
        "id": "math-expr-29",
        "num": 29,
        "title": "Задача 29",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (9 + 2) × 3 - 9\n        </p>",
        "answer": "27",
        "image": "assets/images/expressions_medium_task9.png"
      },
      {
        "id": "math-expr-30",
        "num": 30,
        "title": "Задача 30",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (10 + 2) × 3 - 10\n        </p>",
        "answer": "30",
        "image": "assets/images/expressions_medium_task10.png"
      },
      {
        "id": "math-expr-31",
        "num": 31,
        "title": "Задача 31",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (11 + 2) × 3 - 11\n        </p>",
        "answer": "33",
        "image": "assets/images/expressions_medium_task11.png"
      },
      {
        "id": "math-expr-32",
        "num": 32,
        "title": "Задача 32",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (12 + 2) × 3 - 12\n        </p>",
        "answer": "36",
        "image": "assets/images/expressions_medium_task12.png"
      },
      {
        "id": "math-expr-33",
        "num": 33,
        "title": "Задача 33",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (13 + 2) × 3 - 13\n        </p>",
        "answer": "39",
        "image": "assets/images/expressions_medium_task13.png"
      },
      {
        "id": "math-expr-34",
        "num": 34,
        "title": "Задача 34",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (14 + 2) × 3 - 14\n        </p>",
        "answer": "42",
        "image": "assets/images/expressions_medium_task14.png"
      },
      {
        "id": "math-expr-35",
        "num": 35,
        "title": "Задача 35",
        "text": "<p class=\"task-text\">\n            ычисли значение выражения: (15 + 2) × 3 - 15\n        </p>",
        "answer": "45",
        "image": "assets/images/expressions_medium_task15.png"
      }
    ]
  },
  {
    "id": "math-shares-percentages",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Доли и проценты",
    "class": "4",
    "level": "medium",
    "description": "Задачи на доли, части от целого, проценты и их сравнение.",
    "tasks": [
      {
        "id": "math-share-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            В школе 200 учеников. 25% из них — отличники. Сколько отличников?\r\n        </p>",
        "answer": "50",
        "image": null
      },
      {
        "id": "math-share-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            В корзине 40 яблок. 10% из них — зеленые. Сколько зеленых яблок?\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-share-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            В банке 3000 рублей. Каждый месяц банк добавляет 5%. Сколько рублей прибавится за месяц?\r\n        </p>",
        "answer": "150",
        "image": null
      },
      {
        "id": "math-share-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            В магазине скидка 20% на игрушку, которая стоила 500 рублей. Какова сумма скидки?\r\n        </p>",
        "answer": "100",
        "image": null
      },
      {
        "id": "math-share-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            В коробке 60 конфет. 50% из них — шоколадные. Сколько шоколадных конфет?\r\n        </p>",
        "answer": "30",
        "image": null
      },
      {
        "id": "math-share-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            В школьной библиотеке 200 книг. 25% всех книг составляют сказки. Сколько сказок в школьной библиотеке?\r\n        </p>",
        "answer": "50",
        "image": null
      },
      {
        "id": "math-share-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Мама купила 40 яблок. Вечером семья съела 50% всех яблок. Сколько яблок съела семья?\r\n        </p>",
        "answer": "20",
        "image": null
      },
      {
        "id": "math-share-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            В классе 24 ученика. На контрольной работе по математике 75% учеников получили хорошие и отличные оценки. Сколько учеников получили хорошие и отличные оценки?\r\n        </p>",
        "answer": "18",
        "image": null
      },
      {
        "id": "math-share-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            У Пети в копилке было 80 рублей. Он потратил 25% всех денег на покупку тетради. Сколько рублей потратил Петя на тетрадь?\r\n        </p>",
        "answer": "20",
        "image": null
      },
      {
        "id": "math-share-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            В саду растёт 60 деревьев. 20% всех деревьев — это яблони. Сколько яблонь растёт в саду?\r\n        </p>",
        "answer": "12",
        "image": null
      },
      {
        "id": "math-share-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "3/8",
        "image": "assets/images/shares_and_percentages-shares-easy_tasks-task1.png"
      },
      {
        "id": "math-share-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\r\n            Мама купила пиццу и разделила её на 8 равных кусочков. Саша съел 3 кусочка. Какую долю пиццы съел Саша?\r\n        </p>",
        "answer": "3/8",
        "image": null
      },
      {
        "id": "math-share-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "4/15",
        "image": null
      },
      {
        "id": "math-share-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\r\n            В корзине 15 груш. Петя взял 4 груши. Какую часть всех груш он взял?\r\n        </p>",
        "answer": "4/15",
        "image": null
      },
      {
        "id": "math-share-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "7/17",
        "image": null
      },
      {
        "id": "math-share-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\r\n            В одном пакете 10 печений, а в другом — 7. Какую часть всех печений составляет второй пакет?\r\n        </p>",
        "answer": "7/17",
        "image": null
      },
      {
        "id": "math-share-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "3/13",
        "image": null
      },
      {
        "id": "math-share-18",
        "num": 18,
        "title": "Задача 18",
        "text": "<p class=\"task-text\">\r\n            В стае 13 птиц. 3 из них улетели. Какую часть стаи составляют улетевшие птицы?\r\n        </p>",
        "answer": "3/13",
        "image": null
      },
      {
        "id": "math-share-19",
        "num": 19,
        "title": "Задача 19",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "9/25",
        "image": null
      },
      {
        "id": "math-share-20",
        "num": 20,
        "title": "Задача 20",
        "text": "<p class=\"task-text\">\r\n            В ведре 25 ягод. Коля съел 9 ягод. Какую часть всех ягод он съел?\r\n        </p>",
        "answer": "9/25",
        "image": null
      },
      {
        "id": "math-share-21",
        "num": 21,
        "title": "Задача 21",
        "text": "<p class=\"task-text\">Найди значение доли или процента</p>",
        "answer": "5/8",
        "image": null
      },
      {
        "id": "math-share-22",
        "num": 22,
        "title": "Задача 22",
        "text": "<p class=\"task-text\">\r\n            Огород разделили на 8 одинаковых грядок. 5 грядок заняли морковью. Какую часть огорода заняла морковь?\r\n        </p>",
        "answer": "5/8",
        "image": null
      },
      {
        "id": "math-share-23",
        "num": 23,
        "title": "Задача 23",
        "text": "<p class=\"task-text\">\r\n            В коробке лежит 24 яблока. Маша взяла 1/4 всех яблок. Сколько яблок взяла Маша?\r\n        </p>",
        "answer": "6",
        "image": null
      },
      {
        "id": "math-share-24",
        "num": 24,
        "title": "Задача 24",
        "text": "<p class=\"task-text\">\r\n            Длина ленты — 30 метров. От неё отрезали 1/3 всей ленты. Сколько метров отрезали?\r\n        </p>",
        "answer": "10",
        "image": null
      },
      {
        "id": "math-share-25",
        "num": 25,
        "title": "Задача 25",
        "text": "<p class=\"task-text\">\r\n            В кувшине было 18 литров сока. Ваня выпил 1/6 всего сока. Сколько литров он выпил?\r\n        </p>",
        "answer": "3",
        "image": null
      },
      {
        "id": "math-share-26",
        "num": 26,
        "title": "Задача 26",
        "text": "<p class=\"task-text\">\r\n            В саду растёт 40 кустов, из них 1/5 — розы. Сколько кустов роз?\r\n        </p>",
        "answer": "8",
        "image": null
      },
      {
        "id": "math-share-27",
        "num": 27,
        "title": "Задача 27",
        "text": "<p class=\"task-text\">\r\n            В пакете 35 конфет. Дети съели 1/7 всех конфет. Сколько конфет съели дети?\r\n        </p>",
        "answer": "5",
        "image": null
      }
    ]
  },
  {
    "id": "math-logics",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Задачи на логику",
    "class": "4",
    "level": "medium",
    "description": "Нестандартные логические задачи на сравнение, рассуждения и анализ.",
    "tasks": [
      {
        "id": "math-logic-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Стив построил 6 домов, а Алекс построила на 2 дома больше. Сколько домов построила Алекс?\r\n        </p>",
        "answer": "8",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            У Стива есть 7 алмазов, а у Алекса на 3 алмаза меньше. Сколько алмазов у Алекса?\r\n        </p>",
        "answer": "4",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            В сундуке лежит 8 яблок, 5 морковок и 7 картошек. Сколько всего овощей в сундуке?\r\n        </p>",
        "answer": "12",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Стив посадил 10 деревьев. 4 дерева выросли, а остальные нет. Сколько деревьев не выросло?\r\n        </p>",
        "answer": "6",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            У Стива 3 кирки, а у Алекса в 2 раза больше. Сколько кирок у Алекса?\r\n        </p>",
        "answer": "6",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            В шахте Стив нашёл 5 железных руд и 4 золотых. Сколько всего руд он нашёл?\r\n        </p>",
        "answer": "9",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            У Алекса 9 буханок хлеба. Она дала Стиву 4 буханки хлеба. Сколько буханок осталось у Алекса?\r\n        </p>",
        "answer": "5",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Стив поймал 6 рыб, а Алекс – на 2 рыбы больше. Сколько рыб поймала Алекс?\r\n        </p>",
        "answer": "8",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            В деревне живут 3 жителя, а в соседней деревне на 5 жителей больше. Сколько жителей живёт в двух этих деревнях?\r\n        </p>",
        "answer": "11",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Стив построил башню из 12 блоков. 5 блоков он сломал. Сколько блоков осталось в башне?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">\r\n            У Стива было 10 стрел. В бою он потратил 7 стрел. Сколько стрел осталось у Стива?\r\n        </p>",
        "answer": "3",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\r\n            Алекс собрала 8 цветов, а Стив – 2 цветка. На сколько цветов больше собрала Алекс?\r\n        </p>",
        "answer": "6",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">\r\n            В сундуке 4 железных меча и 3 золотых. Сколько всего мечей в сундуке?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\r\n            Стив взял 5 факелов, Алекс взяла столько же. Сколько всего факелов они взяли вместе?\r\n        </p>",
        "answer": "10",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">\r\n            Алекс построила 7 лестниц, а Стив построил на 3 лестницы меньше. Сколько лестниц построил Стив?\r\n        </p>",
        "answer": "4",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\r\n            Стив, Алекс и Крипер строили дом. Стив работал дольше всех, Алекс меньше всех, а Крипер - не больше Стива. Кто работал среднее время?\r\n        </p>",
        "answer": "Крипер",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">\r\n            В сундуке лежат 3 золотых, 5 железных и 7 алмазных слитков. Стив взял столько железных, сколько золотых, а Алекс взяла столько алмазных, сколько железных. Сколько слитков осталось в сундуке?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-18",
        "num": 18,
        "title": "Задача 18",
        "text": "<p class=\"task-text\">\r\n            У Стива 8 яблок, у Алекса 6, у Эндермена 4. Стив дал 1 яблока Алексу, а Алекс - 2 Эндермену. У кого теперь яблок больше всего? Напиши только имя.\r\n        </p>",
        "answer": "Стив",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-19",
        "num": 19,
        "title": "Задача 19",
        "text": "<p class=\"task-text\">\r\n            В деревне 4 дома. В каждом живёт по 2 жителя, кроме одного, где живёт 3. Сколько всего жителей в деревне?\r\n        </p>",
        "answer": "9",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-20",
        "num": 20,
        "title": "Задача 20",
        "text": "<p class=\"task-text\">\r\n            Стив сложил в ряд 5 блоков: дерево, камень, песок, земля и глина. Блок дерева не рядом с камнем, а блок песка - между камнем и землёй. Каким по счёту стоит блок глины? В ответ запиши словом.\r\n        </p>",
        "answer": "Пятый",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-21",
        "num": 21,
        "title": "Задача 21",
        "text": "<p class=\"task-text\">\r\n            У Стива есть 3 кирки: железная, каменная и деревянная. Железная не самая тяжёлая, деревянная не самая лёгкая. Какая кирка самая тяжёлая?\r\n        </p>",
        "answer": "Каменная",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-22",
        "num": 22,
        "title": "Задача 22",
        "text": "<p class=\"task-text\">\r\n            У Алекса 9 буханок хлеба. Она дала Стиву 4 буханки хлеба. Сколько буханок осталось у Алекса?\r\n        </p>",
        "answer": "5",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-23",
        "num": 23,
        "title": "Задача 23",
        "text": "<p class=\"task-text\">\r\n            Стив поймал 6 рыб, а Алекс – на 2 рыбы больше. Сколько рыб поймала Алекс?\r\n        </p>",
        "answer": "8",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-24",
        "num": 24,
        "title": "Задача 24",
        "text": "<p class=\"task-text\">\r\n            В деревне живут 3 жителя, а в соседней деревне на 5 жителей больше. Сколько жителей живёт в двух этих деревнях?\r\n        </p>",
        "answer": "11",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-25",
        "num": 25,
        "title": "Задача 25",
        "text": "<p class=\"task-text\">\r\n            Стив построил башню из 12 блоков. 5 блоков он сломал. Сколько блоков осталось в башне?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-26",
        "num": 26,
        "title": "Задача 26",
        "text": "<p class=\"task-text\">\r\n            У Стива было 10 стрел. В бою он потратил 7 стрел. Сколько стрел осталось у Стива?\r\n        </p>",
        "answer": "3",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-27",
        "num": 27,
        "title": "Задача 27",
        "text": "<p class=\"task-text\">\r\n            Алекс собрала 8 цветов, а Стив – 2 цветка. На сколько цветов больше собрала Алекс?\r\n        </p>",
        "answer": "6",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-28",
        "num": 28,
        "title": "Задача 28",
        "text": "<p class=\"task-text\">\r\n            В сундуке 4 железных меча и 3 золотых. Сколько всего мечей в сундуке?\r\n        </p>",
        "answer": "7",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-29",
        "num": 29,
        "title": "Задача 29",
        "text": "<p class=\"task-text\">\r\n            Стив взял 5 факелов, Алекс взяла столько же. Сколько всего факелов они взяли вместе?\r\n        </p>",
        "answer": "10",
        "image": "assets/images/task1_butcher_shop.png"
      },
      {
        "id": "math-logic-30",
        "num": 30,
        "title": "Задача 30",
        "text": "<p class=\"task-text\">\r\n            Алекс построила 7 лестниц, а Стив построил на 3 лестницы меньше. Сколько лестниц построил Стив?\r\n        </p>",
        "answer": "4",
        "image": "assets/images/task1_butcher_shop.png"
      }
    ]
  },
  {
    "id": "math-equations",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Уравнения",
    "class": "4",
    "level": "medium",
    "description": "Нахождение неизвестного компонента в уравнениях со скобками.",
    "tasks": [
      {
        "id": "math-eq-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Ученик задумал число. Если это число увеличить в 3 раза, то полученный результат окажется на 18 меньше, чем если бы исходное число умножили на 5. Какое число задумал ученик?\r\n        </p>",
        "answer": "9",
        "image": null
      },
      {
        "id": "math-eq-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            В корзине лежало некоторое количество яблок. Если увеличить их количество в 4 раза, то яблок станет на 27 больше, чем было изначально. Сколько яблок лежало в корзине?\r\n        </p>",
        "answer": "9",
        "image": null
      },
      {
        "id": "math-eq-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Задумали число. Если к нему прибавить 7, а затем полученную сумму умножить на 3, то результат будет равен удвоенному задуманному числу, увеличенному на 31. Найдите задуманное число.\r\n        </p>",
        "answer": "10",
        "image": null
      },
      {
        "id": "math-eq-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Если некоторое число уменьшить на 4, а полученную разность умножить на 6, то получится то же самое, как если бы исходное число просто удвоили. О каком числе идет речь?\r\n        </p>",
        "answer": "6",
        "image": null
      },
      {
        "id": "math-eq-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Задуманное число умножили на 2 и к произведению прибавили 15. В итоге получили значение, которое ровно в 5 раз больше исходного числа. Найдите это число.\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-eq-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Если некоторое положительное число разделить на 3, то результат окажется на 12 меньше самого этого числа. Найдите исходное число.\r\n        </p>",
        "answer": "18",
        "image": null
      },
      {
        "id": "math-eq-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            На доске написано число. Если его умножить на 6, то результат будет на 40 больше, чем если бы это же число умножили на 2. Какое число написано на доске?\r\n        </p>",
        "answer": "10",
        "image": null
      },
      {
        "id": "math-eq-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            К задуманному числу прибавили его половину и в результате получили 27. Найдите задуманное число.\r\n        </p>",
        "answer": "18",
        "image": null
      },
      {
        "id": "math-eq-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Одно число больше другого в 4 раза. Если сложить эти два числа, то в сумме получится 60. Чему равно меньшее из этих чисел?\r\n        </p>",
        "answer": "12",
        "image": null
      },
      {
        "id": "math-eq-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Из задуманного числа вычли 5, результат умножили на 3 и получили число, которое на 2 больше удвоенного исходного числа. Найдите задуманное число.\r\n        </p>",
        "answer": "17",
        "image": null
      }
    ]
  },
  {
    "id": "math-inequalities",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Неравенства",
    "class": "4",
    "level": "medium",
    "description": "Нахождение граничных и допустимых значений в числовых неравенствах.",
    "tasks": [
      {
        "id": "math-ineq-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Найдите минимальное значение x, удовлетворяющие неравенству: x > 7\r\n        </p>",
        "answer": "8",
        "image": null
      },
      {
        "id": "math-ineq-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Найдите максимальное значение y, удовлетворяющие неравенству: y ≤ 12\r\n        </p>",
        "answer": "12",
        "image": null
      },
      {
        "id": "math-ineq-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Найдите максимальное значение x, удовлетворяющие неравенству: x < 3\r\n        </p>",
        "answer": "2",
        "image": null
      },
      {
        "id": "math-ineq-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Найдите минимальное значение a, удовлетворяющие неравенству: a ≥ 15\r\n        </p>",
        "answer": "15",
        "image": null
      },
      {
        "id": "math-ineq-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Найдите минимальное значение x, удовлетворяющие неравенству: x > 8\r\n        </p>",
        "answer": "9",
        "image": null
      },
      {
        "id": "math-ineq-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Найдите максимальное значение y, удовлетворяющие неравенству: y ≤ 1\r\n        </p>",
        "answer": "1",
        "image": null
      },
      {
        "id": "math-ineq-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Найдите максимальное значение x, удовлетворяющие неравенству: x < 25\r\n        </p>",
        "answer": "24",
        "image": null
      },
      {
        "id": "math-ineq-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Найдите минимальное значение z, удовлетворяющие неравенству: z ≥ 5\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-ineq-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Найдите минимальное значение x, удовлетворяющие неравенству: x > 100\r\n        </p>",
        "answer": "101",
        "image": null
      },
      {
        "id": "math-ineq-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Найдите максимальное значение y, удовлетворяющие неравенству: y ≤ 20\r\n        </p>",
        "answer": "20",
        "image": null
      },
      {
        "id": "math-ineq-11",
        "num": 11,
        "title": "Задача 11",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел x, удовлетворяющих неравенству: 2 < x < 8\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-ineq-12",
        "num": 12,
        "title": "Задача 12",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел y, удовлетворяющих неравенству: 5 ≤ y ≤ 9\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-ineq-13",
        "num": 13,
        "title": "Задача 13",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел x, удовлетворяющих неравенству: 0 < x < 6\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-ineq-14",
        "num": 14,
        "title": "Задача 14",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел a, удовлетворяющих неравенству: 3 ≤ a < 5\r\n        </p>",
        "answer": "2",
        "image": "assets/images/task14_bed_crafting.png"
      },
      {
        "id": "math-ineq-15",
        "num": 15,
        "title": "Задача 15",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел x, удовлетворяющих неравенству: 1 < x ≤ 9\r\n        </p>",
        "answer": "8",
        "image": null
      },
      {
        "id": "math-ineq-16",
        "num": 16,
        "title": "Задача 16",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел y, удовлетворяющих неравенству: 2 < y < 7\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-ineq-17",
        "num": 17,
        "title": "Задача 17",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел x, удовлетворяющих неравенству: 4 ≤ x ≤ 12\r\n        </p>",
        "answer": "9",
        "image": null
      },
      {
        "id": "math-ineq-18",
        "num": 18,
        "title": "Задача 18",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел z, удовлетворяющих неравенству: 1 < z < 51\r\n        </p>",
        "answer": "49",
        "image": null
      },
      {
        "id": "math-ineq-19",
        "num": 19,
        "title": "Задача 19",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел x, удовлетворяющих неравенству: 10 ≤ x < 18\r\n        </p>",
        "answer": "8",
        "image": null
      },
      {
        "id": "math-ineq-20",
        "num": 20,
        "title": "Задача 20",
        "text": "<p class=\"task-text\">\r\n            Найдите количество целых чисел y, удовлетворяющих неравенству: 4 ≤ y ≤ 6\r\n        </p>",
        "answer": "3",
        "image": null
      }
    ]
  },
  {
    "id": "math-complex",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Сложные условия",
    "class": "4",
    "level": "hard",
    "description": "Многосоставные сюжетные задачи в несколько действий.",
    "tasks": [
      {
        "id": "math-comp-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            В пекарню привезли муку общим весом 24 кг. При этом 10 пакетов были весом по 2 кг, а остальные пакеты — по 4 кг. Сколько было пакетов весом по 4 кг? Запиши решение и ответ.\r\n        </p>",
        "answer": "1",
        "image": null
      },
      {
        "id": "math-comp-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Для ремонта купили гвозди общим весом 3 кг. Из них 5 пачек были весом по 400 г, а остальные — по 200 г. Сколько было пачек весом по 200 г? Запиши решение и ответ.\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-comp-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            В школьную столовую привезли сок общим объёмом 20 литров. Было 8 пакетов по 2 литра, а остальной сок — в пакетах по 1 литру. Сколько было пакетов по 1 литру? Запиши решение и ответ.\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-comp-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Группа туристов купила билеты на общую сумму 6000 рублей. 4 билета стоили по 900 рублей, а остальные билеты — по 600 рублей. Сколько было куплено билетов по 600 рублей? Запиши решение и ответ.\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-comp-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            На склад привезли коробки с конфетами общим весом 15 кг. 20 коробок весили по 500 г, а остальные — по 250 г. Сколько было коробок весом по 250 г? Запиши решение и ответ.\r\n        </p>",
        "answer": "4",
        "image": null
      },
      {
        "id": "math-comp-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Магазин получил партию крупы общим весом 80 кг. 15 мешков были по 4 кг, а остальные мешки — по 2 кг. Сколько было мешков по 2 кг? Запиши решение и ответ.\r\n        </p>",
        "answer": "20",
        "image": null
      },
      {
        "id": "math-comp-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Для украшения зала купили ленты общей длиной 40 метров. 6 лент были длиной по 5 метров, а остальные — по 2 метра. Сколько было лент длиной по 2 метра? Запиши решение и ответ.\r\n        </p>",
        "answer": "5",
        "image": null
      },
      {
        "id": "math-comp-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            В кофейню завезли сахар общим весом 5 кг. 4 упаковки весили по 800 г, а остальные — по 300 г. Сколько было упаковок по 300 г? Запиши решение и ответ.\r\n        </p>",
        "answer": "6",
        "image": null
      },
      {
        "id": "math-comp-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            В библиотеке расставили книги на полки. Всего поставили 140 книг. На 4 полки поставили по 25 книг, а на остальные полки — по 20 книг. Сколько полок заняли по 20 книг? Запиши решение и ответ.\r\n        </p>",
        "answer": "2",
        "image": null
      },
      {
        "id": "math-comp-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n        Курьер должен доставить посылки общим весом 18 кг. Три посылки весят по 4 кг каждая, а остальные — по 2 кг. Сколько посылок весом по 2 кг должен доставить курьер? Запиши решение и ответ.\r\n        </p>",
        "answer": "3",
        "image": null
      }
    ]
  },
  {
    "id": "math-sales",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Скидки и распродажи",
    "class": "4",
    "level": "easy",
    "description": "Вычисление сдачи, стоимости со скидкой и планирование бюджета.",
    "tasks": [
      {
        "id": "math-sale-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Мама поручила Коле купить в магазине продукты: молоко, кофе, килограмм яблок, 2 килограмма картофеля и яблочный сок. Коля пришёл в магазин и увидел ценники на продукты: Молоко деревенское - 85 рублей, Молоко Кудымкарское - 92 рубля, Кофе арабика - 340 рублей, Кофе Бразилия - 410 рублей, килограмм яблок - 120 рублей (но есть скидка 15%), 2 килограмма картофеля - 80 рублей, Яблочный сок \"Добрый\" - 95 рублей, Яблочный сок \"Фруктовый сад\" - 78 рублей. Сколько денег нужно Коле, чтобы купить все продукты максимально дёшево?\r\n        </p>",
        "answer": "598",
        "image": null
      },
      {
        "id": "math-sale-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Анна решила купить для дачи: семена огурцов, семена помидоров, лопату, лейку и перчатки. В садовом центре она увидела цены: Семена огурцов \"Зозуля\" - 45 рублей, Семена огурцов \"Конкурент\" - 38 рублей, Семена помидоров \"Бычье сердце\" - 52 рубля, Семена помидоров \"Розовый гигант\" - 47 рублей, Лопата штыковая - 890 рублей (скидка 20%), Лопата совковая - 750 рублей, Лейка пластиковая - 320 рублей, Лейка металлическая - 580 рублей (скидка 25%), Перчатки садовые - 120 рублей. Какую минимальную сумму потратит Анна на все покупки?\r\n        </p>",
        "answer": "1364",
        "image": null
      },
      {
        "id": "math-sale-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Петр собирается на рыбалку и хочет купить: удочку, леску, крючки, наживку и термос. В рыболовном магазине он нашёл: Удочка телескопическая - 1200 рублей, Удочка карбоновая - 1900 рублей (скидка 30%), Леска 100м - 180 рублей, Леска 150м - 300 рублей (скидка 40%), Крючки (набор) - 95 рублей, Наживка червь - 60 рублей, Наживка опарыш - 75 рублей, Термос 1л - 450 рублей, Термос 1.5л - 600 рублей (скидка 18%). Сколько минимально потратит Петр?\r\n        </p>",
        "answer": "1930",
        "image": null
      },
      {
        "id": "math-sale-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Мария покупает канцтовары для школы: тетради (10 штук), ручки (5 штук), карандаши (3 штуки), ластик и линейку. В магазине она видит: Тетради в клетку - 25 рублей за штуку, Тетради в линейку - 22 рубля за штуку (при покупке от 8 штук скидка 12%), Ручки синие - 18 рублей за штуку, Ручки чёрные - 20 рублей за штуку (скидка 20% при покупке от 4 штук), Карандаши простые - 12 рублей за штуку, Карандаши цветные - 15 рублей за штуку, Ластик - 8 рублей, Линейка 20см - 25 рублей, Линейка 30см - 35 рублей (скидка 25%). Какая минимальная сумма нужна Марии?\r\n        </p>",
        "answer": "394",
        "image": null
      },
      {
        "id": "math-sale-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Игорь готовится к походу и покупает: рюкзак, спальный мешок, фонарик, котелок и компас. В туристическом магазине цены: Рюкзак 60л - 2400 рублей, Рюкзак 80л - 3200 рублей (скидка 35%), Спальный мешок летний - 1800 рублей (скидка 20%), Спальный мешок зимний - 2900 рублей, Фонарик светодиодный - 380 рублей, Фонарик налобный - 520 рублей (скидка 15%), Котелок алюминиевый - 290 рублей, Котелок стальной - 450 рублей, Компас туристический - 180 рублей. Сколько минимально потратит Игорь?\r\n        </p>",
        "answer": "4322",
        "image": null
      },
      {
        "id": "math-sale-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Елена покупает продукты для праздничного стола: курицу, салат, торт, напитки (2 бутылки) и фрукты (2 кг). В супермаркете она нашла: Курица охлаждённая - 320 рублей за кг, Курица замороженная - 280 рублей за кг (скидка 18%), Салат \"Оливье\" готовый - 180 рублей, Салат \"Цезарь\" готовый - 220 рублей, Торт \"Наполеон\" - 450 рублей (скидка 25%), Торт \"Прага\" - 380 рублей, Сок апельсиновый - 95 рублей за бутылку, Лимонад - 75 рублей за бутылку (скидка 10% при покупке 2 штук), Бананы - 140 рублей за кг, Апельсины - 160 рублей за кг (скидка 20%). Какую минимальную сумму потратит Елена?\r\n        </p>",
        "answer": "817",
        "image": null
      },
      {
        "id": "math-sale-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Дмитрий обустраивает домашний спортзал и покупает: гантели, коврик, скакалку, эспандер и секундомер. В спортивном магазине цены: Гантели 5кг - 1200 рублей, Гантели 8кг - 1600 рублей (скидка 30%), Коврик для йоги - 890 рублей (скидка 15%), Коврик туристический - 650 рублей, Скакалка простая - 180 рублей, Скакалка с счётчиком - 320 рублей, Эспандер резиновый - 250 рублей, Эспандер пружинный - 380 рублей (скидка 20%), Секундомер электронный - 420 рублей. Сколько минимально потратит Дмитрий?\r\n        </p>",
        "answer": "3087",
        "image": null
      },
      {
        "id": "math-sale-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Ольга покупает косметику: крем для лица, шампунь, мыло (3 куска), лак для ногтей и помаду. В косметическом магазине она видит: Крем увлажняющий - 680 рублей, Крем питательный - 750 рублей (скидка 22%), Шампунь для жирных волос - 320 рублей (скидка 15%), Шампунь для сухих волос - 380 рублей, Мыло туалетное - 45 рублей за кусок, Мыло детское - 38 рублей за кусок (скидка 12% при покупке 3 штук), Лак красный - 180 рублей, Лак розовый - 195 рублей, Помада матовая - 450 рублей (скидка 25%), Помада глянцевая - 380 рублей. Какую минимальную сумму потратит Ольга?\r\n        </p>",
        "answer": "1385",
        "image": null
      },
      {
        "id": "math-sale-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Александр покупает автомобильные аксессуары: чехлы на сиденья, коврики, освежитель воздуха, зарядное устройство и видеорегистратор. В автомагазине цены: Чехлы кожаные - 2800 рублей (скидка 28%), Чехлы тканевые - 1900 рублей, Коврики резиновые - 650 рублей, Коврики текстильные - 890 рублей (скидка 20%), Освежитель \"Ёлочка\" - 85 рублей, Освежитель гелевый - 120 рублей, Зарядное устройство USB - 380 рублей (скидка 15%), Зарядное устройство беспроводное - 580 рублей, Видеорегистратор HD - 2200 рублей, Видеорегистратор 4K - 3500 рублей (скидка 35%). Сколько минимально потратит Александр?\r\n        </p>",
        "answer": "4928",
        "image": null
      },
      {
        "id": "math-sale-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Татьяна покупает товары для новорожденного: коляску, кроватку, комбинезон (2 штуки), бутылочки (4 штуки) и игрушку. В детском магазине она нашла: Коляска-трансформер - 15000 рублей (скидка 25%), Коляска прогулочная - 8500 рублей, Кроватка деревянная - 12000 рублей, Кроватка пластиковая - 7800 рублей (скидка 18%), Комбинезон летний - 890 рублей за штуку, Комбинезон зимний - 1200 рублей за штуку (скидка 20% при покупке 2 штук), Бутылочка 250мл - 180 рублей за штуку (скидка 15% при покупке от 3 штук), Бутылочка 150мл - 145 рублей за штуку, Игрушка мягкая - 350 рублей, Игрушка развивающая - 480 рублей (скидка 30%). Какую минимальную сумму потратит Татьяна?\r\n        </p>",
        "answer": "20071",
        "image": null
      }
    ]
  },
  {
    "id": "math-reduction",
    "subject": "math",
    "subjectLabel": "Математика",
    "title": "Сокращение дробей",
    "class": "4",
    "level": "medium",
    "description": "Сокращение обыкновенных дробей до несократимого вида.",
    "tasks": [
      {
        "id": "math-reduct-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">42</span>\r\n                <span class=\"denominator\">98</span>\r\n            </span>\r\n        </p>",
        "answer": "3/7",
        "image": "assets/images/minecraft_pizza_image.png"
      },
      {
        "id": "math-reduct-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">45</span>\r\n                <span class=\"denominator\">120</span>\r\n            </span>\r\n        </p>",
        "answer": "3/8",
        "image": "assets/images/minecraft_lemone_pie.png"
      },
      {
        "id": "math-reduct-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">75</span>\r\n                <span class=\"denominator\">125</span>\r\n            </span>\r\n        </p>",
        "answer": "3/5",
        "image": "assets/images/minecraft_chocolate_pie.png"
      },
      {
        "id": "math-reduct-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">54</span>\r\n                <span class=\"denominator\">144</span>\r\n            </span>\r\n        </p>",
        "answer": "3/8",
        "image": "assets/images/minecraft_basket_of_pies.png"
      },
      {
        "id": "math-reduct-5",
        "num": 5,
        "title": "Задача 5",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">48</span>\r\n                <span class=\"denominator\">72</span>\r\n            </span>\r\n        </p>",
        "answer": "2/3",
        "image": "assets/images/minecraft_basket_of_apples.png"
      },
      {
        "id": "math-reduct-6",
        "num": 6,
        "title": "Задача 6",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">57</span>\r\n                <span class=\"denominator\">95</span>\r\n            </span>\r\n        </p>",
        "answer": "3/5",
        "image": "assets/images/minecraft_apple_pie.png"
      },
      {
        "id": "math-reduct-7",
        "num": 7,
        "title": "Задача 7",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">28</span>\r\n                <span class=\"denominator\">63</span>\r\n            </span>\r\n        </p>",
        "answer": "4/9",
        "image": null
      },
      {
        "id": "math-reduct-8",
        "num": 8,
        "title": "Задача 8",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">105</span>\r\n                <span class=\"denominator\">150</span>\r\n            </span>\r\n        </p>",
        "answer": "7/10",
        "image": null
      },
      {
        "id": "math-reduct-9",
        "num": 9,
        "title": "Задача 9",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">64</span>\r\n                <span class=\"denominator\">96</span>\r\n            </span>\r\n        </p>",
        "answer": "2/3",
        "image": null
      },
      {
        "id": "math-reduct-10",
        "num": 10,
        "title": "Задача 10",
        "text": "<p class=\"task-text\">\r\n            Сократи дробь так, чтоб её нельзя было больше сократить: \r\n        </p>\r\n        <p style=\"font-size: 50px;\">\r\n            <span class=\"fraction\">\r\n                <span class=\"numerator\">81</span>\r\n                <span class=\"denominator\">108</span>\r\n            </span>\r\n        </p>",
        "answer": "3/4",
        "image": null
      }
    ]
  },
  {
    "id": "english-tenses",
    "subject": "english",
    "subjectLabel": "Английский язык",
    "title": "Повторение времён (Tenses)",
    "class": "4",
    "level": "medium",
    "description": "Интерактивные упражнения на Present Simple, Past Simple и Future Simple.",
    "tasks": [
      {
        "id": "eng-1",
        "num": 1,
        "title": "Задание 1",
        "text": "<p class=\"task-text\">Вставь правильную форму глагола <em>to play</em> в Present Simple: <br><strong>He often ________ (play) football with his friends.</strong></p>",
        "answer": "plays",
        "acceptedAnswers": [
          "plays"
        ]
      },
      {
        "id": "eng-2",
        "num": 2,
        "title": "Задание 2",
        "text": "<p class=\"task-text\">Поставь глагол <em>to go</em> в форму Past Simple: <br><strong>Yesterday we ________ (go) to the cinema.</strong></p>",
        "answer": "went",
        "acceptedAnswers": [
          "went"
        ]
      },
      {
        "id": "eng-3",
        "num": 3,
        "title": "Задание 3",
        "text": "<p class=\"task-text\">Раскрой скобки в Future Simple (глагол <em>to help</em>): <br><strong>I promise I ________ (help) you tomorrow.</strong></p>",
        "answer": "will help",
        "acceptedAnswers": [
          "will help",
          "'ll help"
        ]
      },
      {
        "id": "eng-4",
        "num": 4,
        "title": "Задание 4",
        "text": "<p class=\"task-text\">Вставь вспомогательный глагол отрицания для Present Simple: <br><strong>She ________ not like cold milk. (do / does)</strong></p>",
        "answer": "does",
        "acceptedAnswers": [
          "does"
        ]
      },
      {
        "id": "eng-5",
        "num": 5,
        "title": "Задание 5",
        "text": "<p class=\"task-text\">Выбери правильную форму глагола <em>to be</em> в Past Simple для местоимения <em>they</em>: <br><strong>They ________ at school two hours ago. (was / were)</strong></p>",
        "answer": "were",
        "acceptedAnswers": [
          "were"
        ]
      },
      {
        "id": "eng-6",
        "num": 6,
        "title": "Задание 6",
        "text": "<p class=\"task-text\">Поставь глагол <em>to see</em> во вторую форму (Past Simple): <br><strong>I ________ (see) a big black cat in the yard.</strong></p>",
        "answer": "saw",
        "acceptedAnswers": [
          "saw"
        ]
      },
      {
        "id": "eng-7",
        "num": 7,
        "title": "Задание 7",
        "text": "<p class=\"task-text\">Вставь нужное слово: <br><strong>Did you ________ (visit / visited) your grandmother last Sunday?</strong></p>",
        "answer": "visit",
        "acceptedAnswers": [
          "visit"
        ]
      },
      {
        "id": "eng-8",
        "num": 8,
        "title": "Задание 8",
        "text": "<p class=\"task-text\">Закончи предложение: <br><strong>Every morning the sun ________ in the east. (rise / rises)</strong></p>",
        "answer": "rises",
        "acceptedAnswers": [
          "rises"
        ]
      },
      {
        "id": "eng-9",
        "num": 9,
        "title": "Задание 9",
        "text": "<p class=\"task-text\">Поставь глагол <em>to have</em> в прошедшее время: <br><strong>We ________ (have) a wonderful picnic yesterday.</strong></p>",
        "answer": "had",
        "acceptedAnswers": [
          "had"
        ]
      },
      {
        "id": "eng-10",
        "num": 10,
        "title": "Задание 10",
        "text": "<p class=\"task-text\">Раскрой скобки: <br><strong>Tom ________ (not / watch) TV every day. (doesn't watch / didn't watch)</strong></p>",
        "answer": "doesn't watch",
        "acceptedAnswers": [
          "doesn't watch",
          "does not watch"
        ]
      }
    ]
  },
  {
    "id": "english-units",
    "subject": "english",
    "subjectLabel": "Английский язык",
    "title": "Units of Measurement",
    "class": "4",
    "level": "medium",
    "description": "Английские названия единиц измерения (length, weight, volume, time).",
    "tasks": [
      {
        "id": "eng-u-1",
        "num": 1,
        "title": "Задание 1",
        "text": "<p class=\"task-text\">Как по-английски называется единица длины «километр»? Напиши слово по-английски.</p>",
        "answer": "kilometre",
        "acceptedAnswers": [
          "kilometre",
          "kilometer"
        ]
      },
      {
        "id": "eng-u-2",
        "num": 2,
        "title": "Задание 2",
        "text": "<p class=\"task-text\">Как по-английски пишется единица массы «грамм»?</p>",
        "answer": "gram",
        "acceptedAnswers": [
          "gram",
          "gramme"
        ]
      },
      {
        "id": "eng-u-3",
        "num": 3,
        "title": "Задание 3",
        "text": "<p class=\"task-text\">Переведи на английский слово «секунда»:</p>",
        "answer": "second",
        "acceptedAnswers": [
          "second",
          "seconds"
        ]
      },
      {
        "id": "eng-u-4",
        "num": 4,
        "title": "Задание 4",
        "text": "<p class=\"task-text\">Переведи на английский слово «минута»:</p>",
        "answer": "minute",
        "acceptedAnswers": [
          "minute",
          "minutes"
        ]
      },
      {
        "id": "eng-u-5",
        "num": 5,
        "title": "Задание 5",
        "text": "<p class=\"task-text\">Как по-английски называется единица измерения объёма «литр»?</p>",
        "answer": "litre",
        "acceptedAnswers": [
          "litre",
          "liter"
        ]
      },
      {
        "id": "eng-u-6",
        "num": 6,
        "title": "Задание 6",
        "text": "<p class=\"task-text\">Переведи на английский слово «час» (60 минут):</p>",
        "answer": "hour",
        "acceptedAnswers": [
          "hour",
          "hours"
        ]
      },
      {
        "id": "eng-u-7",
        "num": 7,
        "title": "Задание 7",
        "text": "<p class=\"task-text\">Как по-английски называется единица массы «килограмм»?</p>",
        "answer": "kilogram",
        "acceptedAnswers": [
          "kilogram",
          "kilogramme",
          "kg"
        ]
      },
      {
        "id": "eng-u-8",
        "num": 8,
        "title": "Задание 8",
        "text": "<p class=\"task-text\">Какое слово обозначает «метр» по-английски?</p>",
        "answer": "metre",
        "acceptedAnswers": [
          "metre",
          "meter"
        ]
      }
    ]
  },
  {
    "id": "phys-7-measurement",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Физические величины и измерения",
    "class": "7",
    "level": "easy",
    "description": "Измерения длины и объёма, работа со шкалами измерительных приборов и расчёт цены деления.",
    "tasks": [
      {
        "id": "phys-7-m-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Прямоугольный брусок имеет длину 4 см, ширину 3 см и высоту 2 см. Найдите объём бруска в см³.</p>",
        "answer": "24",
        "unit": "см³"
      },
      {
        "id": "phys-7-m-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Между отметками 20 мл и 40 мл на шкале мензурки расположено 4 равных деления. Чему равна цена одного деления мензурки в мл?</p>",
        "answer": "5",
        "unit": "мл"
      },
      {
        "id": "phys-7-m-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">Линейка имеет длину 30 см. Между отметками 0 и 1 см нанесено 10 одинаковых промежутков. Какова цена деления этой линейки в миллиметрах?</p>",
        "answer": "1",
        "unit": "мм"
      },
      {
        "id": "phys-7-m-4",
        "num": 4,
        "title": "Задача 4",
        "text": "<p class=\"task-text\">Выразите объём 2 литра в кубических дециметрах (дм³):</p>",
        "answer": "2",
        "unit": "дм³"
      }
    ]
  },
  {
    "id": "phys-7-motion",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Механическое движение и скорость",
    "class": "7",
    "level": "easy",
    "description": "Путь, время, скорость равномерного прямолинейного движения и траектория.",
    "tasks": [
      {
        "id": "phys-7-mot-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Велосипедист движется равномерно со скоростью 6 м/с в течение 2 минут (120 с). Какой путь в метрах он проедет?</p>",
        "answer": "720",
        "unit": "м"
      },
      {
        "id": "phys-7-mot-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Пешеход прошёл 600 метров за 5 минут (300 секунд). Найдите скорость пешехода в м/с.</p>",
        "answer": "2",
        "unit": "м/с"
      },
      {
        "id": "phys-7-mot-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">Автомобиль движется со скоростью 72 км/ч. Переведите эту скорость в м/с.</p>",
        "answer": "20",
        "unit": "м/с"
      }
    ]
  },
  {
    "id": "phys-7-forces",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Силы в природе и закон Гука",
    "class": "7",
    "level": "medium",
    "description": "Сила тяжести, вес тела, сила упругости и закон Гука (F = kx).",
    "tasks": [
      {
        "id": "phys-7-f-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Под действием силы 20 Н пружина растянулась на 4 см (0,04 м). Найдите жёсткость пружины k в Н/м.</p>",
        "answer": "500",
        "unit": "Н/м"
      },
      {
        "id": "phys-7-f-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Какова сила тяжести, действующая на кирпич массой 4 кг вблизи поверхности Земли? Считайте g = 10 м/с².</p>",
        "answer": "40",
        "unit": "Н"
      },
      {
        "id": "phys-7-f-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">Жёсткость пружины равна 200 Н/м. На сколько сантиметров удлинится пружина под действием силы 10 Н?</p>",
        "answer": "5",
        "unit": "см"
      }
    ]
  },
  {
    "id": "phys-7-pressure-archimedes",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Давление и сила Архимеда",
    "class": "7",
    "level": "hard",
    "description": "Давление твёрдых тел, гидростатическое давление (p = ρgh) и выталкивающая сила Архимеда.",
    "tasks": [
      {
        "id": "phys-7-pa-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Тело массой 60 кг стоит на двух ногах с общей площадью подошв 0,03 м². Какое давление на пол производит человек? g = 10 м/с².</p>",
        "answer": "20000",
        "unit": "Па"
      },
      {
        "id": "phys-7-pa-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Найдите давление воды на глубине 5 метров. Плотность воды ρ = 1000 кг/м³, g = 10 м/с².</p>",
        "answer": "50000",
        "unit": "Па"
      },
      {
        "id": "phys-7-pa-3",
        "num": 3,
        "title": "Задача 3",
        "text": "<p class=\"task-text\">Бетонный блок объёмом 0,2 м³ полностью погружён в воду. Найдите силу Архимеда, действующую на блок. ρ<sub>воды</sub> = 1000 кг/м³, g = 10 м/с².</p>",
        "answer": "2000",
        "unit": "Н"
      }
    ]
  },
  {
    "id": "phys-8-thermal",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Тепловое движение и внутренняя энергия",
    "class": "8",
    "level": "easy",
    "description": "Тестирование (15 заданий): Тепловое движение и внутренняя энергия. Проверка теории, знания формул и понимания физических явлений.",
    "tasks": [
      {
        "id": "phys8-t0-q1",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что в физике называют тепловым движением частиц вещества?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что в физике называют <strong>тепловым движением</strong> частиц вещества?</div>",
        "options": [
          "Непрерывное и беспорядочное (хаотическое) движение частиц, из которых состоит вещество",
          "Упорядоченное прямолинейное движение молекул от нагретого края тела к холодному",
          "Движение тела в пространстве под действием силы тяжести",
          "Колебания электронов вокруг ядер атомов исключительно при нагревании выше 100 °C"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Непрерывное и беспорядочное (хаотическое) движение частиц, из которых состоит вещество"
        ],
        "explanation": "Тепловое движение — это вечное непрерывное хаотическое движение атомов и молекул любого вещества. Интенсивность (средняя скорость) этого движения напрямую определяет температуру тела."
      },
      {
        "id": "phys8-t0-q2",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "В каких единицах Международной системы единиц (СИ) измеряется внутренняя энергия тела?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">В каких единицах Международной системы единиц (СИ) измеряется <strong>внутренняя энергия</strong> тела?</div>",
        "options": [
          "В джоулях (Дж)",
          "В ваттах (Вт)",
          "В градусах Цельсия (°C)",
          "В паскалях (Па)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "В джоулях (Дж)"
        ],
        "explanation": "Внутренняя энергия, как и любой другой вид энергии в физике (кинетическая, потенциальная, механическая), в СИ измеряется в <strong>джоулях (Дж)</strong>. Ватт — единица мощности, градус — температуры, паскаль — давления."
      },
      {
        "id": "phys8-t0-q3",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "В каком из трёх агрегатных состояний одного и того же вещества (при одинаковой температуре) процесс диффузии протекает быстрее всего?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">В каком из трёх агрегатных состояний одного и того же вещества (при одинаковой температуре) процесс <strong>диффузии</strong> протекает быстрее всего?</div>",
        "options": [
          "В газообразном состоянии",
          "В жидком состоянии",
          "В твёрдом кристаллическом состоянии",
          "Скорость диффузии строго одинакова во всех трёх состояниях"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "В газообразном состоянии"
        ],
        "explanation": "В газах средние расстояния между молекулами в десятки раз превышают размеры самих молекул, а силы взаимного притяжения пренебрежимо малы. Молекулы свободно перемещаются с огромными скоростями (сотни м/с), поэтому диффузия в газах идёт быстрее всего."
      },
      {
        "id": "phys8-t0-q4",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "При опиливании напильником металлической детали её внутренняя энергия увеличилась на 450 Дж. Какая механическая работа была совершена при этом, если теплоотдачей в окружающий воздух пренебречь?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">При опиливании напильником металлической детали её внутренняя энергия увеличилась на <strong>450 Дж</strong>. Какая механическая работа была совершена при этом, если теплоотдачей в окружающий воздух пренебречь?</div>",
        "options": [
          "450 Дж",
          "900 Дж",
          "225 Дж",
          "0 Дж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "450 Дж"
        ],
        "explanation": "По первому закону термодинамики при отсутствии теплопередачи в окружающую среду (Q = 0) всё изменение внутренней энергии тела равно совершённой механической работе: ΔU = A. Следовательно, A = 450 Дж."
      },
      {
        "id": "phys8-t0-q5",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какими двумя основными способами можно изменить внутреннюю энергию макроскопического тела?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какими <strong>двумя основными способами</strong> можно изменить внутреннюю энергию макроскопического тела?</div>",
        "options": [
          "Совершением механической работы и теплопередачей",
          "Подъёмом тела на высоту и разгоном его как единого целого",
          "Освещением тела светом и изменением его объёма без трения",
          "Вращением тела вокруг своей оси и взвешиванием на весах"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Совершением механической работы и теплопередачей"
        ],
        "explanation": "Внутреннюю энергию тела можно изменить двумя путями: путём совершения механической работы (трение, сжатие, удар) или путём теплопередачи (теплопроводность, конвекция, излучение) без совершения работы."
      },
      {
        "id": "phys8-t0-q6",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Медную проволоку несколько раз быстро и с силой согнули и разогнули в одном месте. Почему место сгиба заметно нагрелось?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Медную проволоку несколько раз быстро и с силой согнули и разогнули в одном месте. Почему место сгиба заметно нагрелось?</div>",
        "options": [
          "Внешняя механическая работа по деформации кристаллической решётки перешла во внутреннюю энергию проволоки",
          "Из-за резкого сжатия окружающего воздуха вблизи места сгиба",
          "При сгибании из меди выделился статический электрический заряд",
          "Место сгиба нагрелось исключительно за счёт тепла пальцев рук"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Внешняя механическая работа по деформации кристаллической решётки перешла во внутреннюю энергию проволоки"
        ],
        "explanation": "При пластической деформации внешние силы совершают работу против сил сцепления между атомами в кристаллической решётке металла. Эта работа полностью переходит во внутреннюю энергию тела, вызывая нагрев места сгиба."
      },
      {
        "id": "phys8-t0-q7",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Уравнение первого начала термодинамики для тела записывается в виде: ΔU = Q + Aвнеш. Что в этой формуле обозначает величина Q?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Уравнение первого начала термодинамики для тела записывается в виде: <strong>ΔU = Q + A<sub>внеш</sub></strong>. Что в этой формуле обозначает величина <strong>Q</strong>?</div>",
        "options": [
          "Количество теплоты, переданное телу извне",
          "Полную начальную внутреннюю энергию тела",
          "Температуру тела в градусах Цельсия",
          "Удельную теплоёмкость вещества тела"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Количество теплоты, переданное телу извне"
        ],
        "explanation": "Q — это количество теплоты, полученное телом (если Q > 0) или отданное им в окружающую среду (если Q < 0) в процессе теплообмена."
      },
      {
        "id": "phys8-t0-q8",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Газу в герметичном цилиндре сообщили 700 Дж теплоты, и одновременно поршень сжал газ, совершив над ним механическую работу 400 Дж. На сколько джоулей увеличилась внутренняя энергия газа?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Газу в герметичном цилиндре сообщили <strong>700 Дж</strong> теплоты, и одновременно поршень сжал газ, совершив над ним механическую работу <strong>400 Дж</strong>. На сколько джоулей увеличилась внутренняя энергия газа?</div>",
        "options": [
          "На 1100 Дж",
          "На 300 Дж",
          "На 700 Дж",
          "На 280 000 Дж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "На 1100 Дж"
        ],
        "explanation": "По формуле первого начала термодинамики: ΔU = Q + A<sub>внеш</sub> = 700 Дж + 400 Дж = 1100 Дж. Внутренняя энергия газа возросла на 1100 Дж."
      },
      {
        "id": "phys8-t0-q9",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что такое конвекция и в каких телах она физически НЕВОЗМОЖНА?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что такое <strong>конвекция</strong> и в каких телах она физически <strong>НЕВОЗМОЖНА</strong>?</div>",
        "options": [
          "Перенос энергии струями и потоками вещества; невозможна в твёрдых телах и вакууме",
          "Перенос энергии электромагнитным излучением; невозможна в газах",
          "Перенос энергии без перемещения вещества; невозможна в жидкостях",
          "Механическое перемешивание вещества; невозможна в воздухе"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Перенос энергии струями и потоками вещества; невозможна в твёрдых телах и вакууме"
        ],
        "explanation": "Конвекция — вид теплопередачи, при котором энергия переносится потоками жидкости или газа из-за разницы плотностей нагретых и холодных слоёв. В твёрдых телах молекулы жёстко связаны в решётке и перетекать не могут, а в вакууме вещества вовсе нет."
      },
      {
        "id": "phys8-t0-q10",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "В зимние морозы птицы часто сидят на ветках, распушив перья («нахохлившись»). Какой физический смысл заложен в этом явлении?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">В зимние морозы птицы часто сидят на ветках, распушив перья («нахохлившись»). Какой физический смысл заложен в этом явлении?</div>",
        "options": [
          "Между перьями задерживается воздух, обладающий крайне низкой теплопроводностью, что уменьшает теплопотери",
          "Распушенные перья увеличивают общую массу птицы и сохраняют механическую энергию",
          "Распушенные перья лучше поглощают ультрафиолетовое излучение ночного неба",
          "Так птица обеспечивает интенсивное охлаждение внутренних органов"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Между перьями задерживается воздух, обладающий крайне низкой теплопроводностью, что уменьшает теплопотери"
        ],
        "explanation": "Воздух — один из наихудших проводников тепла среди окружающих веществ. Слой неподвижного воздуха, удерживаемый между распушенными перьями, создаёт эффективную теплоизолирующую «шубу», защищающую птицу от переохлаждения."
      },
      {
        "id": "phys8-t0-q11",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Как связана температура тела со средней кинетической энергией хаотического движения его молекул?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Как связана <strong>температура тела</strong> со средней кинетической энергией хаотического движения его молекул?</div>",
        "options": [
          "Температура является мерой средней кинетической энергии движения молекул: чем выше температура, тем быстрее в среднем движутся молекулы",
          "Температура тела определяется исключительно потенциальной энергией взаимодействия молекул",
          "При повышении температуры средняя кинетическая энергия теплового движения молекул уменьшается",
          "Температура тела не зависит от скорости хаотического движения молекул"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Температура является мерой средней кинетической энергии движения молекул: чем выше температура, тем быстрее в среднем движутся молекулы"
        ],
        "explanation": "В молекулярно-кинетической теории температура макроскопического тела служит мерой средней кинетической энергии хаотического поступательного движения его частиц (E<sub>к</sub> ~ T)."
      },
      {
        "id": "phys8-t0-q12",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Свинцовый груз массой 2 кг упал со стола высотой 1,5 м на пол и абсолютно неупруго ударился о него. Приняв g = 10 м/с² и считая, что вся механическая энергия пошла на нагревание груза, найдите увеличение его внутренней энергии.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Свинцовый груз массой <strong>2 кг</strong> упал со стола высотой <strong>1,5 м</strong> на пол и абсолютно неупруго ударился о него. Приняв g = 10 м/с² и считая, что вся механическая энергия пошла на нагревание груза, найдите увеличение его внутренней энергии.</div>",
        "options": [
          "30 Дж",
          "15 Дж",
          "3 Дж",
          "300 Дж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "30 Дж"
        ],
        "explanation": "Начальная потенциальная энергия груза на высоте h равна E<sub>п</sub> = mgh = 2 кг · 10 м/с² · 1,5 м = 30 Дж. При ударе о пол эта механическая энергия полностью переходит во внутреннюю энергию тела: ΔU = E<sub>п</sub> = 30 Дж."
      },
      {
        "id": "phys8-t0-q13",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Каким способом теплопередачи энергия от Солнца доходит до Земли через безвоздушное космическое пространство?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Каким способом теплопередачи энергия от Солнца доходит до Земли через безвоздушное космическое пространство?</div>",
        "options": [
          "Тепловым излучением (электромагнитными волнами)",
          "Конвекцией солнечного газа",
          "Теплопроводностью космической пыли",
          "Диффузией атомов водорода"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Тепловым излучением (электромагнитными волнами)"
        ],
        "explanation": "В глубоком космическом вакууме нет материальной среды для теплопроводности или конвекции. Единственный способ теплообмена в вакууме — электромагнитное излучение (видимый свет, инфракрасные и ультрафиолетовые лучи)."
      },
      {
        "id": "phys8-t0-q14",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Автоцистерны, перевозящие скоропортящиеся жидкие продукты (молоко, квас), на заводах красят в белый или серебристый цвет. С какой физической целью это делается?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Автоцистерны, перевозящие скоропортящиеся жидкие продукты (молоко, квас), на заводах красят в белый или серебристый цвет. С какой физической целью это делается?</div>",
        "options": [
          "Светлые и зеркальные поверхности отражают большую часть лучистой солнечной энергии и меньше нагреваются",
          "Белая краска обладает максимальной теплопроводностью и охлаждает цистерну",
          "Тёмная краска химически реагирует с молоком через сталь цистерны",
          "Белый цвет цистерны уменьшает массу перевозимого груза"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Светлые и зеркальные поверхности отражают большую часть лучистой солнечной энергии и меньше нагреваются"
        ],
        "explanation": "Тёмные матовые поверхности сильно поглощают видимое и инфракрасное излучение Солнца и быстро греются. Светлые и зеркальные поверхности большую часть падающего излучения отражают, предотвращая нежелательный нагрев содержимого."
      },
      {
        "id": "phys8-t0-q15",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "При сжатии газа в цилиндре внешняя сила совершила работу 600 Дж, при этом газ передал в окружающую среду 250 Дж теплоты. На сколько джоулей изменилась внутренняя энергия газа?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">При сжатии газа в цилиндре внешняя сила совершила работу <strong>600 Дж</strong>, при этом газ передал в окружающую среду <strong>250 Дж</strong> теплоты. На сколько джоулей изменилась внутренняя энергия газа?</div>",
        "options": [
          "Увеличилась на 350 Дж",
          "Увеличилась на 850 Дж",
          "Уменьшилась на 350 Дж",
          "Увеличилась на 250 Дж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Увеличилась на 350 Дж"
        ],
        "explanation": "По первому началу термодинамики: ΔU = A<sub>внеш</sub> - Q<sub>отд</sub> = 600 Дж - 250 Дж = +350 Дж. Внутренняя энергия газа возросла на 350 Дж."
      }
    ],
    "isTest": true,
    "testGrade": "8",
    "testIndex": 0,
    "testUrl": "pages/physics/tasks/index.html?grade=8&test=0"
  },
  {
    "id": "phys-8-heat-capacity",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Количество теплоты и теплоёмкость",
    "class": "8",
    "level": "medium",
    "description": "Тестирование (15 заданий): Количество теплоты и теплоёмкость. Проверка теории, знания формул и понимания физических явлений.",
    "tasks": [
      {
        "id": "phys8-t1-q1",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что показывает удельная теплоёмкость вещества?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что показывает <strong>удельная теплоёмкость вещества</strong>?</div>",
        "options": [
          "Количество теплоты, необходимое для нагревания 1 кг вещества на 1 °C",
          "Полное количество теплоты, содержащееся в одном кубическом метре вещества",
          "Температуру, при которой вещество полностью переходит в газообразное состояние",
          "Количество теплоты, выделяющееся при полном сгорании 1 кг топлива"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Количество теплоты, необходимое для нагревания 1 кг вещества на 1 °C"
        ],
        "explanation": "Удельная теплоёмкость c численно равна количеству теплоты, которое необходимо передать 1 кг данного вещества, чтобы изменить его температуру на 1 °C (или на 1 К)."
      },
      {
        "id": "phys8-t1-q2",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Какова единица измерения удельной теплоёмкости в Международной системе единиц (СИ)?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Какова единица измерения <strong>удельной теплоёмкости</strong> в Международной системе единиц (СИ)?</div>",
        "options": [
          "Дж / (кг · °C)",
          "Дж · кг · °C",
          "Дж / кг",
          "Вт / (кг · °C)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Дж / (кг · °C)"
        ],
        "explanation": "Из формулы c = Q / (m · Δt) единица измерения удельной теплоёмкости: [c] = Дж / (кг · °C) или Дж / (кг · К)."
      },
      {
        "id": "phys8-t1-q3",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "По какой формуле рассчитывается количество теплоты Q, необходимое для нагревания тела массой m от начальной температуры t₁ до конечной t₂?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">По какой формуле рассчитывается количество теплоты <strong>Q</strong>, необходимое для нагревания тела массой <strong>m</strong> от начальной температуры <strong>t₁</strong> до конечной <strong>t₂</strong>?</div>",
        "options": [
          "Q = c · m · (t₂ − t₁)",
          "Q = c · m / (t₂ − t₁)",
          "Q = λ · m",
          "Q = m · (t₂ − t₁) / c"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Q = c · m · (t₂ − t₁)"
        ],
        "explanation": "Количество теплоты при нагревании или охлаждении тела прямо пропорционально удельной теплоёмкости вещества c, массе тела m и разности температур Δt = t₂ − t₁: Q = cm(t₂ − t₁)."
      },
      {
        "id": "phys8-t1-q4",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какое количество теплоты потребуется, чтобы нагреть медную деталь массой 2 кг от 20 °C до 70 °C? Удельная теплоёмкость меди c = 400 Дж/(кг·°C).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какое количество теплоты потребуется, чтобы нагреть медную деталь массой <strong>2 кг</strong> от 20 °C до 70 °C? Удельная теплоёмкость меди c = 400 Дж/(кг·°C).</div>",
        "options": [
          "40 кДж (40 000 Дж)",
          "20 кДж (20 000 Дж)",
          "56 кДж (56 000 Дж)",
          "4 кДж (4 000 Дж)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "40 кДж (40 000 Дж)"
        ],
        "explanation": "Изменение температуры: Δt = 70 °C − 20 °C = 50 °C. Вычисляем количество теплоты: Q = c · m · Δt = 400 Дж/(кг·°C) · 2 кг · 50 °C = 40 000 Дж = 40 кДж."
      },
      {
        "id": "phys8-t1-q5",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему в приморских городах суточные и сезонные колебания температуры воздуха значительно мягче, чем в глубине континента?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему в приморских городах суточные и сезонные колебания температуры воздуха значительно мягче, чем в глубине континента?</div>",
        "options": [
          "Вода обладает огромной удельной теплоёмкостью (4200 Дж/(кг·°C)), медленно прогревается днём/летом и медленно остывает ночью/зимой",
          "Морская вода отражает 100% солнечного света обратно в космос",
          "Плотность солёной морской воды выше плотности пресной воды",
          "Над водной поверхностью полностью отсутствует тепловое излучение"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Вода обладает огромной удельной теплоёмкостью (4200 Дж/(кг·°C)), медленно прогревается днём/летом и медленно остывает ночью/зимой"
        ],
        "explanation": "Удельная теплоёмкость воды исключительно велика (4200 Дж/(кг·°C)). Огромные массы воды аккумулируют гигантские объёмы тепла в тёплый период и медленно отдают его атмосфере при похолодании, смягчая климат."
      },
      {
        "id": "phys8-t1-q6",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какое количество теплоты выделится при остывании чугунной отливки массой 5 кг от 120 °C до 20 °C? Удельная теплоёмкость чугуна c = 540 Дж/(кг·°C).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какое количество теплоты выделится при остывании чугунной отливки массой <strong>5 кг</strong> от 120 °C до 20 °C? Удельная теплоёмкость чугуна c = 540 Дж/(кг·°C).</div>",
        "options": [
          "270 кДж (270 000 Дж)",
          "54 кДж (54 000 Дж)",
          "135 кДж (135 000 Дж)",
          "540 кДж (540 000 Дж)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "270 кДж (270 000 Дж)"
        ],
        "explanation": "Δt = 120 °C − 20 °C = 100 °C. Количество выделившейся теплоты: Q = c · m · Δt = 540 · 5 · 100 = 270 000 Дж = 270 кДж."
      },
      {
        "id": "phys8-t1-q7",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Как формулируется уравнение теплового баланса для изолированной системы тел при отсутствии потерь тепла в окружающую среду?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Как формулируется <strong>уравнение теплового баланса</strong> для изолированной системы тел при отсутствии потерь тепла в окружающую среду?</div>",
        "options": [
          "Q<sub>полученное</sub> = Q<sub>отданное</sub> (алгебраическая сумма всех Q = 0)",
          "Q<sub>полученное</sub> · Q<sub>отданное</sub> = 1",
          "Q<sub>полученное</sub> − Q<sub>отданное</sub> = m · g · h",
          "Q = c · m · g"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Q<sub>полученное</sub> = Q<sub>отданное</sub> (алгебраическая сумма всех Q = 0)"
        ],
        "explanation": "На основании закона сохранения энергии количество теплоты, отданное остывающими телами, в точности равно количеству теплоты, принятому нагревающимися телами: Q<sub>получ</sub> = Q<sub>отд</sub>."
      },
      {
        "id": "phys8-t1-q8",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "В теплоизолированный сосуд налили 300 г воды при 20 °C и 300 г воды при 80 °C. Какая температура смеси установится после перемешивания?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">В теплоизолированный сосуд налили <strong>300 г</strong> воды при 20 °C и <strong>300 г</strong> воды при 80 °C. Какая температура смеси установится после перемешивания?</div>",
        "options": [
          "50 °C",
          "40 °C",
          "60 °C",
          "100 °C"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "50 °C"
        ],
        "explanation": "Так как смешиваются равные массы одного и того же вещества (m₁ = m₂, c₁ = c₂), конечная температура смеси равна точно среднему арифметическому: t = (20 + 80) / 2 = 50 °C."
      },
      {
        "id": "phys8-t1-q9",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "В две одинаковые кастрюли налили равные массы воды и подсолнечного масла при 20 °C и поставили на одинаковые горелки. Какая жидкость нагреется до 70 °C быстрее, если cмасла ≈ 1700 Дж/(кг·°C), а cводы = 4200 Дж/(кг·°C)?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">В две одинаковые кастрюли налили равные массы воды и подсолнечного масла при 20 °C и поставили на одинаковые горелки. Какая жидкость нагреется до 70 °C быстрее, если c<sub>масла</sub> ≈ 1700 Дж/(кг·°C), а c<sub>воды</sub> = 4200 Дж/(кг·°C)?</div>",
        "options": [
          "Подсолнечное масло, так как его удельная теплоёмкость почти в 2,5 раза меньше",
          "Вода, так как её плотность больше плотности масла",
          "Обе жидкости нагреются строго за одинаковое время",
          "Ни одна жидкость не нагреется без предварительного закипания"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Подсолнечное масло, так как его удельная теплоёмкость почти в 2,5 раза меньше"
        ],
        "explanation": "Чем меньше удельная теплоёмкость вещества c, тем меньше тепла Q = cmΔt требуется на каждый градус нагрева при одной и той же массе. Маслу требуется значительно меньше энергии, и на одинаковой горелке оно прогреется быстрее."
      },
      {
        "id": "phys8-t1-q10",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Зависит ли удельная теплоёмкость меди от того, взят ли массивный медный слиток массой 50 кг или маленькая медная монета массой 5 г?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Зависит ли удельная теплоёмкость меди от того, взят ли массивный медный слиток массой 50 кг или маленькая медная монета массой 5 г?</div>",
        "options": [
          "Нет, удельная теплоёмкость — свойство самого вещества и не зависит от массы или формы тела",
          "Да, у слитка теплоёмкость больше, так как его масса в 10 000 раз больше",
          "Да, у монеты теплоёмкость больше, так как она нагревается быстрее",
          "Зависит только от площади поперечного сечения изделия"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Нет, удельная теплоёмкость — свойство самого вещества и не зависит от массы или формы тела"
        ],
        "explanation": "Удельная теплоёмкость c рассчитывается на 1 кг вещества. Она зависит исключительно от рода вещества и его агрегатного состояния, но не от массы или геометрической формы образца."
      },
      {
        "id": "phys8-t1-q11",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Металлическому бруску массой 500 г (0,5 кг) сообщили 1900 Дж теплоты, при этом он нагрелся на 10 °C. Определите удельную теплоёмкость этого металла.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Металлическому бруску массой <strong>500 г (0,5 кг)</strong> сообщили <strong>1900 Дж</strong> теплоты, при этом он нагрелся на <strong>10 °C</strong>. Определите удельную теплоёмкость этого металла.</div>",
        "options": [
          "380 Дж / (кг · °C)",
          "950 Дж / (кг · °C)",
          "190 Дж / (кг · °C)",
          "760 Дж / (кг · °C)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "380 Дж / (кг · °C)"
        ],
        "explanation": "Из формулы Q = cmΔt выражаем c: c = Q / (m · Δt) = 1900 Дж / (0,5 кг · 10 °C) = 1900 / 5 = 380 Дж/(кг·°C) (это удельная теплоёмкость латуни)."
      },
      {
        "id": "phys8-t1-q12",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Алюминиевую и серебряную ложки одинаковой массы нагрели в кипятке до 100 °C и опустили в одинаковые стаканы с холодной водой. В каком стакане вода нагреется сильнее, если cалюм = 920 Дж/(кг·°C), а cсеребра = 250 Дж/(кг·°C)?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Алюминиевую и серебряную ложки одинаковой массы нагрели в кипятке до 100 °C и опустили в одинаковые стаканы с холодной водой. В каком стакане вода нагреется сильнее, если c<sub>алюм</sub> = 920 Дж/(кг·°C), а c<sub>серебра</sub> = 250 Дж/(кг·°C)?</div>",
        "options": [
          "В стакане с алюминиевой ложкой, так как её удельная теплоёмкость почти в 4 раза выше",
          "В стакане с серебряной ложкой, так как серебро благородный металл",
          "Вода в обоих стаканах нагреется до абсолютно одинаковой температуры",
          "Вода не нагреется ни в одном стакане"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "В стакане с алюминиевой ложкой, так как её удельная теплоёмкость почти в 4 раза выше"
        ],
        "explanation": "Количество теплоты, отдаваемое остывающим телом: Q = cmΔt. Поскольку массы ложек и начальные температуры одинаковы, алюминиевая ложка за счёт высокой теплоёмкости отдаст в воду в 920 / 250 ≈ 3,7 раза больше тепла, чем серебряная."
      },
      {
        "id": "phys8-t1-q13",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Выразите массу тела m из формулы количества теплоты Q = c · m · Δt:",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Выразите массу тела <strong>m</strong> из формулы количества теплоты <strong>Q = c · m · Δt</strong>:</div>",
        "options": [
          "m = Q / (c · Δt)",
          "m = Q · c / Δt",
          "m = c · Δt / Q",
          "m = Q · c · Δt"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "m = Q / (c · Δt)"
        ],
        "explanation": "Разделив обе части уравнения Q = c · m · Δt на произведение c · Δt, получаем корректное выражение для массы тела: m = Q / (c · Δt)."
      },
      {
        "id": "phys8-t1-q14",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Воду массой 2 кг нагрели от 20 °C до температуры кипения 100 °C. Сколько килоджоулей теплоты пошло на нагревание воды? cводы = 4200 Дж/(кг·°C).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Воду массой <strong>2 кг</strong> нагрели от 20 °C до температуры кипения 100 °C. Сколько килоджоулей теплоты пошло на нагревание воды? c<sub>воды</sub> = 4200 Дж/(кг·°C).</div>",
        "options": [
          "672 кДж",
          "840 кДж",
          "168 кДж",
          "336 кДж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "672 кДж"
        ],
        "explanation": "Δt = 100 °C − 20 °C = 80 °C. Вычисляем количество теплоты: Q = 4200 Дж/(кг·°C) · 2 кг · 80 °C = 672 000 Дж = 672 кДж."
      },
      {
        "id": "phys8-t1-q15",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что происходит с температурами двух контактирующих тел с разной начальной температурой до наступления теплового равновесия?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что происходит с температурами двух контактирующих тел с разной начальной температурой до наступления теплового равновесия?</div>",
        "options": [
          "Температура горячего тела падает, холодного — растёт, пока их температуры не сравняются",
          "Температура горячего тела возрастает ещё выше, а холодного — остаётся неизменной",
          "Температуры обоих тел одновременно падают до 0 °C",
          "Теплообмен происходит без какого-либо изменения температур тел"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Температура горячего тела падает, холодного — растёт, пока их температуры не сравняются"
        ],
        "explanation": "Теплота самопроизвольно переходит от более нагретого тела к менее нагретому. В результате горячее тело охлаждается, а холодное нагревается, пока температуры тел не станут равными (состояние теплового равновесия)."
      }
    ],
    "isTest": true,
    "testGrade": "8",
    "testIndex": 1,
    "testUrl": "pages/physics/tasks/index.html?grade=8&test=1"
  },
  {
    "id": "phys-8-richman",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Закон Ньютона–Рихмана",
    "class": "8",
    "level": "medium",
    "description": "Тестирование (15 заданий): Закон Ньютона–Рихмана. Проверка теории, знания формул и понимания физических явлений.",
    "tasks": [
      {
        "id": "phys8-t2-q1",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какую физическую закономерность устанавливает закон охлаждения Ньютона–Рихмана?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какую физическую закономерность устанавливает <strong>закон охлаждения Ньютона–Рихмана</strong>?</div>",
        "options": [
          "Мощность теплоотдачи тела пропорциональна площади поверхности и разности температур тела и окружающей среды",
          "Скорость испарения жидкости пропорциональна внешнему атмосферному давлению",
          "Сила трения скольжения пропорциональна квадрату относительной скорости движения",
          "Внутренняя энергия газа прямо пропорциональна кубу его объёма"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Мощность теплоотдачи тела пропорциональна площади поверхности и разности температур тела и окружающей среды"
        ],
        "explanation": "Закон Ньютона–Рихмана гласит, что тепловой поток (мощность теплоотдачи) от нагретой поверхности к окружающей среде прямо пропорционален площади поверхности теплообмена S и температурному напору (T<sub>пов</sub> − T<sub>ср</sub>)."
      },
      {
        "id": "phys8-t2-q2",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "В формуле закона Ньютона–Рихмана P = α · S · (Tпов − Tср), что обозначает коэффициент α (альфа)?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">В формуле закона Ньютона–Рихмана <strong>P = α · S · (T<sub>пов</sub> − T<sub>ср</sub>)</strong>, что обозначает коэффициент <strong>α (альфа)</strong>?</div>",
        "options": [
          "Коэффициент теплоотдачи",
          "Удельную теплоёмкость вещества",
          "Коэффициент полезного действия радиатора",
          "Коэффициент поверхностного натяжения"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Коэффициент теплоотдачи"
        ],
        "explanation": "α — это коэффициент теплоотдачи, характеризующий интенсивность теплообмена между поверхностью тела и окружающей средой (зависит от свойств среды, скорости обдува и формы тела)."
      },
      {
        "id": "phys8-t2-q3",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Какова единица измерения коэффициента теплоотдачи α в Международной системе единиц (СИ)?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Какова единица измерения <strong>коэффициента теплоотдачи α</strong> в Международной системе единиц (СИ)?</div>",
        "options": [
          "Вт / (м² · °C) [или Вт / (м² · К)]",
          "Дж / (кг · °C)",
          "Вт · м² / °C",
          "Па / м²"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Вт / (м² · °C) [или Вт / (м² · К)]"
        ],
        "explanation": "Из формулы α = P / (S · ΔT) получаем единицу измерения: [α] = Вт / (м² · °C) или Вт / (м² · К), так как мощность измеряется в ваттах (Вт), площадь — в м², а разность температур — в °C (или К)."
      },
      {
        "id": "phys8-t2-q4",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Площадь поверхности радиатора отопления равна 1,5 м², коэффициент теплоотдачи α = 10 Вт/(м²·°C). Температура радиатора 70 °C, температура воздуха в комнате 20 °C. Найдите мощность теплоотдачи радиатора.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Площадь поверхности радиатора отопления равна <strong>1,5 м²</strong>, коэффициент теплоотдачи α = <strong>10 Вт/(м²·°C)</strong>. Температура радиатора 70 °C, температура воздуха в комнате 20 °C. Найдите мощность теплоотдачи радиатора.</div>",
        "options": [
          "750 Вт",
          "1050 Вт",
          "300 Вт",
          "50 Вт"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "750 Вт"
        ],
        "explanation": "Разность температур: ΔT = 70 °C − 20 °C = 50 °C. Вычисляем мощность теплоотдачи: P = α · S · ΔT = 10 Вт/(м²·°C) · 1,5 м² · 50 °C = 750 Вт."
      },
      {
        "id": "phys8-t2-q5",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему радиаторы кулеров процессоров компьютеров и радиаторы автомобилей конструируют со множеством тонких металлических рёбер?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему радиаторы кулеров процессоров компьютеров и радиаторы автомобилей конструируют со множеством тонких металлических рёбер?</div>",
        "options": [
          "Множество рёбер многократно увеличивает площадь поверхности S, что резко повышает мощность отвода тепла P",
          "Рёбра охлаждают окружающий воздух за счёт химической реакции",
          "Рёбра снижают общую массу изделия и тем самым уменьшают теплоёмкость",
          "Рёбра полностью блокируют движение воздуха возле процессора"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Множество рёбер многократно увеличивает площадь поверхности S, что резко повышает мощность отвода тепла P"
        ],
        "explanation": "По закону Ньютона–Рихмана мощность теплоотдачи P прямо пропорциональна площади поверхности соприкосновения со средой (P ~ S). Тонкие рёбра позволяют развить площадь до нескольких квадратных метров в компактном объёме."
      },
      {
        "id": "phys8-t2-q6",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Мощность теплоотдачи металлического шара равна 48 Вт. Площадь поверхности шара 0,08 м², а разность температур поверхности и воздуха составляет 40 °C. Найдите коэффициент теплоотдачи α.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Мощность теплоотдачи металлического шара равна <strong>48 Вт</strong>. Площадь поверхности шара <strong>0,08 м²</strong>, а разность температур поверхности и воздуха составляет <strong>40 °C</strong>. Найдите коэффициент теплоотдачи α.</div>",
        "options": [
          "15 Вт / (м² · °C)",
          "24 Вт / (м² · °C)",
          "8 Вт / (м² · °C)",
          "1,2 Вт / (м² · °C)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "15 Вт / (м² · °C)"
        ],
        "explanation": "Из формулы P = α · S · ΔT выражаем α: α = P / (S · ΔT) = 48 Вт / (0,08 м² · 40 °C) = 48 / 3,2 = 15 Вт/(м²·°C)."
      },
      {
        "id": "phys8-t2-q7",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что такое плотность теплового потока q и как она связана с полной мощностью теплоотдачи P?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что такое <strong>плотность теплового потока q</strong> и как она связана с полной мощностью теплоотдачи P?</div>",
        "options": [
          "q = P / S — это тепловая мощность, проходящая через единицу площади поверхности",
          "q = P · S — это произведение мощности на площадь",
          "q = P / t — это скорость изменения мощности во времени",
          "q — это масса тепла, переносимого молекулами за секунду"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "q = P / S — это тепловая мощность, проходящая через единицу площади поверхности"
        ],
        "explanation": "Плотность теплового потока q — это тепловая мощность, приходящаяся на 1 м² площади поверхности: q = P / S = α(T<sub>пов</sub> − T<sub>ср</sub>)."
      },
      {
        "id": "phys8-t2-q8",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "В каких единицах СИ измеряется плотность теплового потока q?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">В каких единицах СИ измеряется <strong>плотность теплового потока q</strong>?</div>",
        "options": [
          "Вт / м²",
          "Дж / с²",
          "Вт · м²",
          "Дж / (кг · м²)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Вт / м²"
        ],
        "explanation": "По определению q = P / S. Мощность P измеряется в ваттах (Вт), площадь S — в квадратных метрах (м²). Следовательно, единица измерения плотности теплового потока — Вт/м²."
      },
      {
        "id": "phys8-t2-q9",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему горячий чай в кружке остывает в несколько раз быстрее, если на него дуть или поставить под струю вентилятора?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему горячий чай в кружке остывает в несколько раз быстрее, если на него дуть или поставить под струю вентилятора?</div>",
        "options": [
          "Вынужденное движение воздуха сдувает приграничный прогретый слой, резко увеличивая коэффициент теплоотдачи α и испарение",
          "Движущийся воздух уменьшает удельную теплоёмкость чая",
          "Обдув уменьшает площадь открытой поверхности кружки",
          "Движение воздуха охлаждает чашку за счёт замедления молекул чая"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Вынужденное движение воздуха сдувает приграничный прогретый слой, резко увеличивая коэффициент теплоотдачи α и испарение"
        ],
        "explanation": "При обдуве тёплый пограничный слой воздуха непрерывно заменяется свежим холодным воздухом (вынужденная конвекция), что резко повышает коэффициент теплоотдачи α и интенсифицирует испарение с поверхности."
      },
      {
        "id": "phys8-t2-q10",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Кружка с горячим чаем отдаёт тепло воздуху температурой 20 °C с мощностью 16 Вт. Площадь её внешней поверхности 0,04 м², коэффициент теплоотдачи α = 8 Вт/(м²·°C). Какова температура поверхности кружки?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Кружка с горячим чаем отдаёт тепло воздуху температурой 20 °C с мощностью <strong>16 Вт</strong>. Площадь её внешней поверхности <strong>0,04 м²</strong>, коэффициент теплоотдачи α = <strong>8 Вт/(м²·°C)</strong>. Какова температура поверхности кружки?</div>",
        "options": [
          "70 °C",
          "50 °C",
          "90 °C",
          "60 °C"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "70 °C"
        ],
        "explanation": "P = α · S · (T<sub>пов</sub> − T<sub>ср</sub>) => T<sub>пов</sub> − T<sub>ср</sub> = P / (α · S) = 16 / (8 · 0,04) = 16 / 0,32 = 50 °C. Тогда T<sub>пов</sub> = 20 °C + 50 °C = 70 °C."
      },
      {
        "id": "phys8-t2-q11",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Согласно закону Ньютона–Рихмана, в каком направлении самопроизвольно передаётся тепло между поверхностью тела и окружающей средой?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Согласно закону Ньютона–Рихмана, в каком направлении самопроизвольно передаётся тепло между поверхностью тела и окружающей средой?</div>",
        "options": [
          "Всегда от поверхности с более высокой температурой к среде с более низкой температурой",
          "Всегда от окружающей среды к телу независимо от их температур",
          "Направление передачи энергии зависит только от площади поверхности тела",
          "Теплота передаётся в обоих направлениях строго в равных количествах"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Всегда от поверхности с более высокой температурой к среде с более низкой температурой"
        ],
        "explanation": "В соответствии со вторым началом термодинамики тепло самопроизвольно переходит от более нагретой поверхности к менее нагретой среде (положительный тепловой поток при T<sub>пов</sub> > T<sub>ср</sub>)."
      },
      {
        "id": "phys8-t2-q12",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Если площадь поверхности тела увеличить в 3 раза, не меняя при этом разность температур и коэффициент теплоотдачи α, как изменится плотность теплового потока q?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Если площадь поверхности тела увеличить в <strong>3 раза</strong>, не меняя при этом разность температур и коэффициент теплоотдачи α, как изменится <strong>плотность теплового потока q</strong>?</div>",
        "options": [
          "Не изменится, так как плотность потока q = α · ΔT зависит только от α и разности температур",
          "Увеличится в 3 раза",
          "Уменьшится в 3 раза",
          "Увеличится в 9 раз"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Не изменится, так как плотность потока q = α · ΔT зависит только от α и разности температур"
        ],
        "explanation": "Плотность теплового потока рассчитывается на единицу площади: q = P / S = α · ΔT. От площади S зависит полная мощность P, а локальная плотность потока q при неизменных α и ΔT остаётся постоянной."
      },
      {
        "id": "phys8-t2-q13",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "При разности температур тела и воздуха 60 °C мощность теплоотдачи составляла 180 Вт. Какой станет мощность теплоотдачи этого же тела, когда при остывании разность температур уменьшится до 20 °C (считая α постоянным)?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">При разности температур тела и воздуха <strong>60 °C</strong> мощность теплоотдачи составляла <strong>180 Вт</strong>. Какой станет мощность теплоотдачи этого же тела, когда при остывании разность температур уменьшится до <strong>20 °C</strong> (считая α постоянным)?</div>",
        "options": [
          "60 Вт",
          "90 Вт",
          "30 Вт",
          "120 Вт"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "60 Вт"
        ],
        "explanation": "По закону Ньютона–Рихмана мощность P прямо пропорциональна разности температур ΔT (P ~ ΔT). Разность температур уменьшилась в 60 / 20 = 3 раза, значит и мощность теплоотдачи уменьшится ровно в 3 раза: P₂ = 180 / 3 = 60 Вт."
      },
      {
        "id": "phys8-t2-q14",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему на сильном морозе металлический поручень кажется руке значительно холоднее деревянной доски, находящейся при точно такой же температуре −15 °C?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему на сильном морозе металлический поручень кажется руке значительно холоднее деревянной доски, находящейся при точно такой же температуре −15 °C?</div>",
        "options": [
          "Металл обладает огромной теплопроводностью и вызывает высокий коэффициент теплоотдачи от кожи руки, стремительно забирая тепло",
          "Температура металла на улице всегда на 10 градусов ниже температуры дерева",
          "Дерево вырабатывает собственное тепло благодаря трению волокон",
          "Металл излучает отрицательную тепловую энергию"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Металл обладает огромной теплопроводностью и вызывает высокий коэффициент теплоотдачи от кожи руки, стремительно забирая тепло"
        ],
        "explanation": "Ощущение холода создаётся не температурой предмета, а скоростью оттока тепла от рецепторов кожи. Высокая теплопроводность металла обеспечивает мощный отвод тепла от руки, тогда как дерево — отличный теплоизолятор с медленной теплоотдачей."
      },
      {
        "id": "phys8-t2-q15",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Металлическая пластина площадью 0,2 м² имеет температуру 50 °C при температуре воздуха 20 °C. Коэффициент теплоотдачи α = 15 Вт/(м²·°C). Какое количество теплоты отдаст пластина за 5 минут (300 секунд)?",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Металлическая пластина площадью <strong>0,2 м²</strong> имеет температуру 50 °C при температуре воздуха 20 °C. Коэффициент теплоотдачи α = <strong>15 Вт/(м²·°C)</strong>. Какое количество теплоты отдаст пластина за <strong>5 минут (300 секунд)</strong>?</div>",
        "options": [
          "27 000 Дж (27 кДж)",
          "90 Дж",
          "9 000 Дж (9 кДж)",
          "180 000 Дж (180 кДж)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "27 000 Дж (27 кДж)"
        ],
        "explanation": "Мощность теплоотдачи: P = α · S · ΔT = 15 · 0,2 · (50 − 20) = 15 · 0,2 · 30 = 90 Вт. Количество отданной теплоты: Q = P · t = 90 Вт · 300 с = 27 000 Дж = 27 кДж."
      }
    ],
    "isTest": true,
    "testGrade": "8",
    "testIndex": 2,
    "testUrl": "pages/physics/tasks/index.html?grade=8&test=2"
  },
  {
    "id": "phys-8-melting",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Плавление и кристаллизация",
    "class": "8",
    "level": "medium",
    "description": "Тестирование (15 заданий): Плавление и кристаллизация. Проверка теории, знания формул и понимания физических явлений.",
    "tasks": [
      {
        "id": "phys8-t3-q1",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какой физический процесс называют плавлением вещества?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какой физический процесс называют <strong>плавлением</strong> вещества?</div>",
        "options": [
          "Переход вещества из твёрдого кристаллического состояния в жидкое",
          "Переход жидкости в газообразное состояние при нагревании",
          "Переход газа в жидкое состояние при охлаждении",
          "Размягчение полимера без образования свободной жидкости"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Переход вещества из твёрдого кристаллического состояния в жидкое"
        ],
        "explanation": "Плавление — это фазовый переход вещества из твёрдого кристаллического состояния в жидкое, происходящий с поглощением теплоты при постоянной температуре плавления."
      },
      {
        "id": "phys8-t3-q2",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Что происходит с температурой кристаллического вещества в процессе его плавления, пока весь кристалл не расплавится?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Что происходит с <strong>температурой кристаллического вещества</strong> в процессе его плавления, пока весь кристалл не расплавится?</div>",
        "options": [
          "Температура остаётся строго постоянной и равной температуре плавления",
          "Температура непрерывно возрастает прямо пропорционально подводимому теплу",
          "Температура сначала падает до абсолютного нуля, затем возрастает",
          "Температура хаотически колеблется вверх и вниз"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Температура остаётся строго постоянной и равной температуре плавления"
        ],
        "explanation": "Пока в сосуде сосуществуют твёрдая и жидкая фазы чистого кристаллического вещества, вся подводимая теплота идёт на разрушение кристаллической решётки. Кинетическая энергия молекул не растёт, поэтому температура строго постоянна."
      },
      {
        "id": "phys8-t3-q3",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "На что расходуется энергия, подводимая к кристаллическому телу во время плавления при неизменной температуре?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">На что расходуется энергия, подводимая к кристаллическому телу во время плавления при неизменной температуре?</div>",
        "options": [
          "На преодоление сил притяжения между частицами и разрушение кристаллической решётки (рост потенциальной энергии)",
          "На увеличение скорости поступательного движения молекул (рост кинетической энергии)",
          "На ионизацию атомов и ядерные реакции в веществе",
          "Энергия полностью уходит в виде теплового излучения в пространство"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "На преодоление сил притяжения между частицами и разрушение кристаллической решётки (рост потенциальной энергии)"
        ],
        "explanation": "Так как температура при плавлении постоянна, средняя кинетическая энергия теплового движения молекул не меняется. Подводимая теплота идёт на преодоление межатомных связей, увеличивая потенциальную энергию взаимодействия частиц."
      },
      {
        "id": "phys8-t3-q4",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "По какой формуле рассчитывается количество теплоты Q, необходимое для плавления кристаллического тела массой m при температуре плавления?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">По какой формуле рассчитывается количество теплоты <strong>Q</strong>, необходимое для плавления кристаллического тела массой <strong>m</strong> при температуре плавления?</div>",
        "options": [
          "Q = λ · m",
          "Q = c · m · Δt",
          "Q = L · m",
          "Q = q · m"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Q = λ · m"
        ],
        "explanation": "Количество теплоты, необходимое для плавления тела, взятого при температуре плавления, равно произведению удельной теплоты плавления λ на массу вещества m: Q = λm."
      },
      {
        "id": "phys8-t3-q5",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "В каких единицах СИ измеряется удельная теплота плавления λ (лямбда)?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">В каких единицах СИ измеряется <strong>удельная теплота плавления λ (лямбда)</strong>?</div>",
        "options": [
          "Дж / кг",
          "Дж / (кг · °C)",
          "Вт / кг",
          "Дж · кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Дж / кг"
        ],
        "explanation": "Из формулы λ = Q / m единица измерения удельной теплоты плавления в СИ: [λ] = Дж / кг."
      },
      {
        "id": "phys8-t3-q6",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какое количество теплоты потребуется для плавления куска льда массой 4 кг, взятого при температуре 0 °C? Удельная теплота плавления льда λ = 330 кДж/кг (330 000 Дж/кг).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какое количество теплоты потребуется для плавления куска льда массой <strong>4 кг</strong>, взятого при температуре 0 °C? Удельная теплота плавления льда λ = <strong>330 кДж/кг (330 000 Дж/кг)</strong>.</div>",
        "options": [
          "1320 кДж (1 320 000 Дж)",
          "330 кДж",
          "660 кДж",
          "82,5 кДж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "1320 кДж (1 320 000 Дж)"
        ],
        "explanation": "Q = λ · m = 330 кДж/кг · 4 кг = 1320 кДж = 1 320 000 Дж."
      },
      {
        "id": "phys8-t3-q7",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какой физический процесс называют кристаллизацией (отвердеванием)?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какой физический процесс называют <strong>кристаллизацией (отвердеванием)</strong>?</div>",
        "options": [
          "Переход вещества из жидкого состояния в твёрдое кристаллическое",
          "Выпадение хлопьев в химическом растворе",
          "Переход пара в капли жидкости",
          "Остывание твёрдого кристалла без смены фазового состояния"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Переход вещества из жидкого состояния в твёрдое кристаллическое"
        ],
        "explanation": "Кристаллизация — обратный плавлению процесс перехода вещества из жидкой фазы в кристаллическую твёрдую, происходящий при температуре кристаллизации с выделением энергии."
      },
      {
        "id": "phys8-t3-q8",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Выделяется или поглощается энергия при кристаллизации жидкости при постоянной температуре отвердевания?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Выделяется или поглощается энергия при кристаллизации жидкости при постоянной температуре отвердевания?</div>",
        "options": [
          "Энергия выделяется в окружающую среду в количестве Q = λ · m",
          "Энергия поглощается жидкостью из окружающей среды",
          "Энергия не выделяется и не поглощается",
          "Сначала поглощается, а в самом конце резко выделяется"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Энергия выделяется в окружающую среду в количестве Q = λ · m"
        ],
        "explanation": "При формировании связей кристаллической решётки потенциальная энергия молекул уменьшается. Избыток энергии выделяется в окружающую среду в виде тепла кристаллизации (Q = λm)."
      },
      {
        "id": "phys8-t3-q9",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "При кристаллизации расплавленного свинца массой 2 кг, находящегося при температуре плавления, в среду выделилось 50 кДж теплоты. Найдите удельную теплоту плавления свинца.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">При кристаллизации расплавленного свинца массой <strong>2 кг</strong>, находящегося при температуре плавления, в среду выделилось <strong>50 кДж</strong> теплоты. Найдите удельную теплоту плавления свинца.</div>",
        "options": [
          "25 кДж / кг (25 000 Дж/кг)",
          "100 кДж / кг",
          "50 кДж / кг",
          "12,5 кДж / кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "25 кДж / кг (25 000 Дж/кг)"
        ],
        "explanation": "Из формулы Q = λ · m выражаем λ: λ = Q / m = 50 кДж / 2 кг = 25 кДж/кг = 25 000 Дж/кг."
      },
      {
        "id": "phys8-t3-q10",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "В идеальный термос со смесью колотого льда и талой воды при 0 °C долили 500 г воды при 0 °C. Что произойдёт со смесью со временем?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">В идеальный термос со смесью колотого льда и талой воды при 0 °C долили 500 г воды при 0 °C. Что произойдёт со смесью со временем?</div>",
        "options": [
          "Количество льда и воды останется неизменным: лёд не растает, а вода не замёрзнет",
          "Весь лёд мгновенно растает за счёт кинетической энергии струи",
          "Вся вода в термосе полностью замёрзнет в монолитный лёд",
          "Температура системы опустится ниже нуля градусов"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Количество льда и воды останется неизменным: лёд не растает, а вода не замёрзнет"
        ],
        "explanation": "Для фазового перехода необходим теплообмен, который невозможен при отсутствии разности температур (ΔT = 0). Система лёд-вода при 0 °C находится в устойчивом термодинамическом равновесии."
      },
      {
        "id": "phys8-t3-q11",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Брусок олова массой 1 кг при температуре 132 °C нагрели до температуры плавления (232 °C) и полностью расплавили. Сколько всего килоджоулей теплоты затрачено? cолова = 230 Дж/(кг·°C), λолова = 59 кДж/кг.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Брусок олова массой <strong>1 кг</strong> при температуре 132 °C нагрели до температуры плавления (232 °C) и полностью расплавили. Сколько всего килоджоулей теплоты затрачено? c<sub>олова</sub> = 230 Дж/(кг·°C), λ<sub>олова</sub> = 59 кДж/кг.</div>",
        "options": [
          "82 кДж",
          "59 кДж",
          "23 кДж",
          "141 кДж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "82 кДж"
        ],
        "explanation": "1) Нагревание: Q₁ = cmΔt = 230 · 1 · (232 − 132) = 23 000 Дж = 23 кДж. 2) Плавление: Q₂ = λm = 59 кДж · 1 = 59 кДж. Общее количество теплоты: Q = 23 + 59 = 82 кДж."
      },
      {
        "id": "phys8-t3-q12",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "На графике зависимости температуры кристаллического тела от времени нагревания наблюдается горизонтальный участок (параллельный оси времени). Какой процесс там протекает?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">На графике зависимости температуры кристаллического тела от времени нагревания наблюдается горизонтальный участок (параллельный оси времени). Какой процесс там протекает?</div>",
        "options": [
          "Плавление кристаллического вещества при постоянной температуре",
          "Остывание нагретого кристалла",
          "Нагревание твёрдого тела до температуры плавления",
          "Нагревание образовавшейся жидкости"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Плавление кристаллического вещества при постоянной температуре"
        ],
        "explanation": "Горизонтальный участок на графике нагрева означает постоянство температуры при непрерывном подводе энергии, что является главным признаком фазового перехода — плавления кристалла."
      },
      {
        "id": "phys8-t3-q13",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Чем аморфные тела (стекло, смола, парафин, воск) отличаются от кристаллических при нагревании?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Чем <strong>аморфные тела</strong> (стекло, смола, парафин, воск) отличаются от кристаллических при нагревании?</div>",
        "options": [
          "У аморфных тел нет фиксированной температуры плавления: они размягчаются постепенно в широком температурном интервале",
          "Аморфные тела в принципе не способны переходить в жидкое состояние",
          "Аморфные тела плавятся при строго постоянной температуре без размягчения",
          "При нагревании аморфные тела всегда самопроизвольно кристаллизуются"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "У аморфных тел нет фиксированной температуры плавления: они размягчаются постепенно в широком температурном интервале"
        ],
        "explanation": "В аморфных телах нет строго упорядоченной кристаллической решётки (нет дальнего порядка). Поэтому они не имеют постоянной точки плавления и при нагреве постепенно размягчаются в непрерывном диапазоне температур."
      },
      {
        "id": "phys8-t3-q14",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какую массу железа можно расплавить при температуре плавления, если сообщить ему 540 кДж (540 000 Дж) теплоты? Удельная теплота плавления железа λ = 270 кДж/кг (270 000 Дж/кг).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какую массу железа можно расплавить при температуре плавления, если сообщить ему <strong>540 кДж (540 000 Дж)</strong> теплоты? Удельная теплота плавления железа λ = <strong>270 кДж/кг (270 000 Дж/кг)</strong>.</div>",
        "options": [
          "2 кг",
          "0,5 кг",
          "4 кг",
          "1,5 кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "2 кг"
        ],
        "explanation": "Из формулы Q = λ · m выражаем массу: m = Q / λ = 540 000 Дж / 270 000 Дж/кг = 2 кг."
      },
      {
        "id": "phys8-t3-q15",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Перед весенними ночными заморозками в теплицах иногда расставляют широкие чаны с водой. Какой физический механизм защищает растения?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Перед весенними ночными заморозками в теплицах иногда расставляют широкие чаны с водой. Какой физический механизм защищает растения?</div>",
        "options": [
          "При замерзании вода кристаллизуется и выделяет колоссальное количество теплоты (330 кДж на каждый кг), согревая воздух",
          "Вода химически поглощает холодный воздух",
          "Замёрзшая вода притягивает инфракрасное излучение луны",
          "Лёд в чанах отражает холод обратно в форточки"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "При замерзании вода кристаллизуется и выделяет колоссальное количество теплоты (330 кДж на каждый кг), согревая воздух"
        ],
        "explanation": "Замерзание воды сопровождается выделением огромной удельной теплоты кристаллизации (λ = 330 000 Дж/кг). Остывая и кристаллизуясь, вода обогревает объём теплицы, поддерживая температуру около 0 °C."
      }
    ],
    "isTest": true,
    "testGrade": "8",
    "testIndex": 3,
    "testUrl": "pages/physics/tasks/index.html?grade=8&test=3"
  },
  {
    "id": "phys-8-boiling",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Испарение, кипение и конденсация",
    "class": "8",
    "level": "hard",
    "description": "Тестирование (15 заданий): Испарение, кипение и конденсация. Проверка теории, знания формул и понимания физических явлений.",
    "tasks": [
      {
        "id": "phys8-t4-q1",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "В чём заключается принципиальное отличие между двумя видами парообразования — испарением и кипением?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">В чём заключается принципиальное отличие между двумя видами парообразования — <strong>испарением</strong> и <strong>кипением</strong>?</div>",
        "options": [
          "Испарение идёт с открытой поверхности жидкости при любой температуре, а кипение — по всему объёму при строго определённой температуре кипения",
          "Испарение происходит только при 100 °C, а кипение — при любой температуре выше нуля",
          "При испарении тепло выделяется, а при кипении поглощается",
          "Испарение возможно только у воды, а кипение — у любых органических жидкостей"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Испарение идёт с открытой поверхности жидкости при любой температуре, а кипение — по всему объёму при строго определённой температуре кипения"
        ],
        "explanation": "Испарение — это поверхностное парообразование при любой температуре. Кипение — интенсивный процесс образования и роста пузырьков пара по всему объёму жидкости при фиксированной температуре кипения."
      },
      {
        "id": "phys8-t4-q2",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему жидкость при испарении заметно охлаждается, если к ней нет притока теплоты извне?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему жидкость при испарении заметно охлаждается, если к ней нет притока теплоты извне?</div>",
        "options": [
          "Жидкость покидают наиболее быстрые молекулы с наибольшей кинетической энергией, поэтому средняя кинетическая энергия оставшихся частиц падает",
          "Молекулы пара уносят с собой силу тяжести жидкости",
          "При испарении молекулы внутри жидкости полностью останавливаются",
          "Образующийся пар давит на жидкость сверху и охлаждает её давлением"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Жидкость покидают наиболее быстрые молекулы с наибольшей кинетической энергией, поэтому средняя кинетическая энергия оставшихся частиц падает"
        ],
        "explanation": "Преодолеть силы притяжения соседей и вылететь из жидкости могут только молекулы с максимальной кинетической энергией. Уход самых «быстрых» молекул снижает среднюю кинетическую энергию оставшихся, что означает падение температуры."
      },
      {
        "id": "phys8-t4-q3",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "От каких факторов зависит скорость испарения жидкости с открытого сосуда?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">От каких факторов зависит <strong>скорость испарения</strong> жидкости с открытого сосуда?</div>",
        "options": [
          "От рода жидкости, её температуры, площади свободной поверхности и наличия движения воздуха (ветра)",
          "Только от глубины сосуда и атмосферного давления",
          "Только от толщины стенок сосуда",
          "От плотности дна сосуда и освещённости комнаты"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "От рода жидкости, её температуры, площади свободной поверхности и наличия движения воздуха (ветра)"
        ],
        "explanation": "Скорость испарения возрастает при повышении температуры жидкости, увеличении свободной поверхности зеркала жидкости, наличии ветра (уносящего пар) и зависит от рода жидкости (сил межмолекулярного сцепления)."
      },
      {
        "id": "phys8-t4-q4",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "По какой формуле рассчитывается количество теплоты Q, необходимое для превращения кипящей жидкости массой m в пар при постоянной температуре кипения?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">По какой формуле рассчитывается количество теплоты <strong>Q</strong>, необходимое для превращения кипящей жидкости массой <strong>m</strong> в пар при постоянной температуре кипения?</div>",
        "options": [
          "Q = L · m",
          "Q = c · m · Δt",
          "Q = λ · m",
          "Q = q · m"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Q = L · m"
        ],
        "explanation": "Количество теплоты парообразования вычисляется по формуле Q = Lm, где L — удельная теплота парообразования вещества при температуре кипения."
      },
      {
        "id": "phys8-t4-q5",
        "type": "formula",
        "typeLabel": "⚡ Знание формул",
        "text": "Какова единица измерения удельной теплоты парообразования L в СИ?",
        "html": "<div class=\"btd-q-badge\">⚡ Знание формул</div><div class=\"btd-q-text\">Какова единица измерения <strong>удельной теплоты парообразования L</strong> в СИ?</div>",
        "options": [
          "Дж / кг",
          "Дж / (кг · °C)",
          "Вт / м²",
          "Дж · кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Дж / кг"
        ],
        "explanation": "Из формулы L = Q / m единица измерения удельной теплоты парообразования в СИ: [L] = Дж / кг."
      },
      {
        "id": "phys8-t4-q6",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какое количество теплоты потребуется затратить, чтобы полностью обратить в пар 3 кг кипящей воды при температуре 100 °C? Удельная теплота парообразования воды L = 2,3 · 10⁶ Дж/кг (2,3 МДж/кг).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какое количество теплоты потребуется затратить, чтобы полностью обратить в пар <strong>3 кг</strong> кипящей воды при температуре 100 °C? Удельная теплота парообразования воды L = <strong>2,3 · 10⁶ Дж/кг (2,3 МДж/кг)</strong>.</div>",
        "options": [
          "6,9 МДж (6 900 000 Дж)",
          "4,6 МДж (4 600 000 Дж)",
          "2,3 МДж (2 300 000 Дж)",
          "0,77 МДж (770 000 Дж)"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "6,9 МДж (6 900 000 Дж)"
        ],
        "explanation": "Q = L · m = 2,3 · 10⁶ Дж/кг · 3 кг = 6,9 · 10⁶ Дж = 6,9 МДж = 6 900 000 Дж."
      },
      {
        "id": "phys8-t4-q7",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Что в термодинамике называют динамическим равновесием между жидкостью и её паром в закрытом сосуде?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Что в термодинамике называют <strong>динамическим равновесием</strong> между жидкостью и её паром в закрытом сосуде?</div>",
        "options": [
          "Состояние, при котором число молекул, вылетающих из жидкости за 1 секунду, равно числу молекул пара, возвращающихся обратно в жидкость",
          "Состояние, при котором испарение жидкости полностью прекращается",
          "Состояние, когда плотность пара становится равной плотности жидкости",
          "Состояние, когда температура пара становится выше температуры жидкости"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Состояние, при котором число молекул, вылетающих из жидкости за 1 секунду, равно числу молекул пара, возвращающихся обратно в жидкость"
        ],
        "explanation": "Динамическое равновесие наступает, когда процессы испарения и конденсации идут с одинаковой скоростью: сколько молекул покидает жидкость за единицу времени, столько же молекул пара возвращается обратно."
      },
      {
        "id": "phys8-t4-q8",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какой пар называют насыщенным?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какой пар называют <strong>насыщенным</strong>?</div>",
        "options": [
          "Пар, находящийся в состоянии динамического равновесия со своей жидкостью",
          "Пар, нагретый до температуры свыше 250 °C",
          "Пар, содержащий взвешенные капельки пыли и солей",
          "Любой пар, невидимый человеческому глазу"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Пар, находящийся в состоянии динамического равновесия со своей жидкостью"
        ],
        "explanation": "Насыщенным называется пар, находящийся в термодинамическом динамическом равновесии со своей жидкостью в замкнутом объёме при данной температуре."
      },
      {
        "id": "phys8-t4-q9",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему ожог стоградусным водяным паром значительно опаснее и глубже ожога кипятком (водой при 100 °C) точно такой же массы?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему ожог стоградусным водяным паром значительно опаснее и глубже ожога кипятком (водой при 100 °C) точно такой же массы?</div>",
        "options": [
          "Пар при соприкосновении с кожей сначала конденсируется, выделяя колоссальную теплоту (2,3 МДж на каждый кг), и лишь затем остывает образовавшийся кипяток",
          "Температура пара на самом деле в несколько раз превышает температуру кипятка",
          "Молекулы пара обладают ядовитыми химическими свойствами",
          "Пар растворяет верхний слой клеток за счёт кислотности"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Пар при соприкосновении с кожей сначала конденсируется, выделяя колоссальную теплоту (2,3 МДж на каждый кг), и лишь затем остывает образовавшийся кипяток"
        ],
        "explanation": "При конденсации 1 кг пара выделяется гигантская удельная теплота фазового перехода L = 2 300 000 Дж! Образовавшийся кипяток при 100 °C продолжает отдавать тепло при остывании. Поэтому пар передаёт телу в разы больше теплоты, чем просто кипяток."
      },
      {
        "id": "phys8-t4-q10",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "При конденсации водяного пара при 100 °C выделилось 9,2 МДж (9 200 000 Дж) теплоты. Какая масса пара сконденсировалась в воду? L = 2,3 · 10⁶ Дж/кг.",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">При конденсации водяного пара при 100 °C выделилось <strong>9,2 МДж (9 200 000 Дж)</strong> теплоты. Какая масса пара сконденсировалась в воду? L = <strong>2,3 · 10⁶ Дж/кг</strong>.</div>",
        "options": [
          "4 кг",
          "2 кг",
          "8 кг",
          "21,16 кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "4 кг"
        ],
        "explanation": "Из формулы Q = L · m выражаем массу: m = Q / L = 9 200 000 Дж / 2 300 000 Дж/кг = 4 кг."
      },
      {
        "id": "phys8-t4-q11",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Как изменяется температура кипения воды при подъёме высоко в горы, где атмосферное давление заметно ниже нормального?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Как изменяется <strong>температура кипения воды</strong> при подъёме высоко в горы, где атмосферное давление заметно ниже нормального?</div>",
        "options": [
          "Понижается (вода закипает при температуре ниже 100 °C)",
          "Повышается (вода закипает при температуре выше 100 °C)",
          "Остаётся строго неизменной и равной 100 °C на любой высоте",
          "Вода в горах вообще теряет способность кипеть"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Понижается (вода закипает при температуре ниже 100 °C)"
        ],
        "explanation": "Жидкость закипает тогда, когда давление её насыщенного пара сравнивается с внешним давлением. В горах внешнее давление ниже, поэтому давление пара достигает его при более низкой температуре (на вершине Эльбруса вода кипит при ≈82 °C)."
      },
      {
        "id": "phys8-t4-q12",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Воду массой 1 кг при температуре 20 °C нагрели до 100 °C и полностью выпарили. Сколько всего килоджоулей теплоты затрачено? cводы = 4200 Дж/(кг·°C), L = 2,3 · 10⁶ Дж/кг (2300 кДж/кг).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Воду массой <strong>1 кг</strong> при температуре 20 °C нагрели до 100 °C и полностью выпарили. Сколько всего килоджоулей теплоты затрачено? c<sub>воды</sub> = 4200 Дж/(кг·°C), L = 2,3 · 10⁶ Дж/кг (2300 кДж/кг).</div>",
        "options": [
          "2636 кДж (2,636 МДж)",
          "2300 кДж (2,3 МДж)",
          "336 кДж (0,336 МДж)",
          "1964 кДж"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "2636 кДж (2,636 МДж)"
        ],
        "explanation": "1) Нагревание: Q₁ = cmΔt = 4200 · 1 · (100 − 20) = 336 000 Дж = 336 кДж. 2) Испарение: Q₂ = Lm = 2 300 000 Дж = 2300 кДж. Полное тепло: Q = Q₁ + Q₂ = 336 + 2300 = 2636 кДж = 2,636 МДж."
      },
      {
        "id": "phys8-t4-q13",
        "type": "concept",
        "typeLabel": "💡 Понимание темы",
        "text": "Почему в скороварке (кастрюле с герметично завинчивающейся крышкой и клапаном) продукты варятся значительно быстрее, чем в обычной открытой кастрюле?",
        "html": "<div class=\"btd-q-badge\">💡 Понимание темы</div><div class=\"btd-q-text\">Почему в скороварке (кастрюле с герметично завинчивающейся крышкой и клапаном) продукты варятся значительно быстрее, чем в обычной открытой кастрюле?</div>",
        "options": [
          "Пар не выходит наружу, давление внутри растёт, и вода кипит при повышенной температуре (115–120 °C)",
          "В скороварке ускоряется броуновское движение продуктов за счёт давления",
          "Герметичная крышка генерирует ультразвук, разрушающий пищу",
          "В скороварке вода испаряется в 5 раз быстрее"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Пар не выходит наружу, давление внутри растёт, и вода кипит при повышенной температуре (115–120 °C)"
        ],
        "explanation": "В закрытом сосуде давление пара повышается до 1,5–2 атмосфер. При повышенном давлении температура кипения воды поднимается выше 100 °C (до 115–120 °C), что существенно ускоряет процесс термообработки пищи."
      },
      {
        "id": "phys8-t4-q14",
        "type": "theory",
        "typeLabel": "📖 Теория",
        "text": "Какой физический процесс называют конденсацией?",
        "html": "<div class=\"btd-q-badge\">📖 Теория</div><div class=\"btd-q-text\">Какой физический процесс называют <strong>конденсацией</strong>?</div>",
        "options": [
          "Переход вещества из газообразного (парообразного) состояния в жидкое",
          "Превращение жидкости в твёрдый кристаллический лёд",
          "Испарение жидкости с открытой водной глади",
          "Растворение твёрдого кристалла в воде"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "Переход вещества из газообразного (парообразного) состояния в жидкое"
        ],
        "explanation": "Конденсация — это фазовый переход вещества из пара (газа) в жидкую форму. Процесс конденсации сопровождается выделением в окружающую среду энергии парообразования: Q = Lm."
      },
      {
        "id": "phys8-t4-q15",
        "type": "problem",
        "typeLabel": "📐 Расчётная задача",
        "text": "Какая масса медицинского эфира сконденсировалась при температуре кипения 35 °C, если в окружающую среду выделилось 800 кДж (800 000 Дж) теплоты? Удельная теплота парообразования эфира L = 4 · 10⁵ Дж/кг (400 кДж/кг).",
        "html": "<div class=\"btd-q-badge\">📐 Расчётная задача</div><div class=\"btd-q-text\">Какая масса медицинского эфира сконденсировалась при температуре кипения 35 °C, если в окружающую среду выделилось <strong>800 кДж (800 000 Дж)</strong> теплоты? Удельная теплота парообразования эфира L = <strong>4 · 10⁵ Дж/кг (400 кДж/кг)</strong>.</div>",
        "options": [
          "2 кг",
          "4 кг",
          "0,5 кг",
          "3,2 кг"
        ],
        "correctIndex": 0,
        "answer": "1",
        "acceptedAnswers": [
          "1",
          "0",
          "а",
          "a",
          "2 кг"
        ],
        "explanation": "Из формулы Q = L · m выражаем массу сконденсировавшегося эфира: m = Q / L = 800 000 Дж / 400 000 Дж/кг = 2 кг."
      }
    ],
    "isTest": true,
    "testGrade": "8",
    "testIndex": 4,
    "testUrl": "pages/physics/tasks/index.html?grade=8&test=4"
  },
  {
    "id": "phys-9-kinematics",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Равноускоренное движение",
    "class": "9",
    "level": "easy",
    "description": "Ускорение, скорость и путь при прямолинейном равноускоренном движении.",
    "tasks": [
      {
        "id": "phys-9-k-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Автомобиль увеличил скорость с 0 до 20 м/с за 5 секунд. Найдите ускорение автомобиля в м/с².</p>",
        "answer": "4",
        "unit": "м/с²"
      },
      {
        "id": "phys-9-k-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Тело начинает движение из состояния покоя с ускорением 2 м/с². Какой путь в метрах оно пройдёт за 5 секунд? (s = at²/2).</p>",
        "answer": "25",
        "unit": "м"
      }
    ]
  },
  {
    "id": "phys-9-newton",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Законы Ньютона",
    "class": "9",
    "level": "medium",
    "description": "Второй закон Ньютона (F = ma) и взаимодействие тел.",
    "tasks": [
      {
        "id": "phys-9-n-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">На тело массой 3 кг действует постоянная сила 18 Н. Найдите ускорение тела в м/с².</p>",
        "answer": "6",
        "unit": "м/с²"
      },
      {
        "id": "phys-9-n-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Тележка массой 2 кг движется с ускорением 4 м/с². Трения нет. Найдите величину действующей горизонтальной силы в ньютонах.</p>",
        "answer": "8",
        "unit": "Н"
      }
    ]
  },
  {
    "id": "phys-9-momentum",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Импульс и закон его сохранения",
    "class": "9",
    "level": "hard",
    "description": "Импульс тела (p = mv) и закон сохранения импульса в замкнутой системе.",
    "tasks": [
      {
        "id": "phys-9-mom-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Тело массой 0,5 кг движется со скоростью 12 м/с. Найдите модуль импульса тела в кг·м/с.</p>",
        "answer": "6",
        "unit": "кг·м/с"
      },
      {
        "id": "phys-9-mom-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Тележка массой 2 кг, движущаяся со скоростью 3 м/с, сталкивается с неподвижной тележкой массой 1 кг и сцепляется с ней. Какова общая скорость тележек после удара в м/с?</p>",
        "answer": "2",
        "unit": "м/с"
      }
    ]
  },
  {
    "id": "phys-9-energy",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Механическая энергия",
    "class": "9",
    "level": "hard",
    "description": "Кинетическая и потенциальная энергия, закон сохранения механической энергии.",
    "tasks": [
      {
        "id": "phys-9-en-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Груз массой 2 кг свободно падает с высоты 5 м. Сопротивлением воздуха пренебречь, g = 10 м/с². Найдите кинетическую энергию груза перед ударом о землю в джоулях.</p>",
        "answer": "100",
        "unit": "Дж"
      },
      {
        "id": "phys-9-en-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Снаряд массой 4 кг летит со скоростью 50 м/с. Найдите кинетическую энергию снаряда (E = mv²/2) в джоулях.</p>",
        "answer": "5000",
        "unit": "Дж"
      }
    ]
  },
  {
    "id": "phys-10-kinematics-dynamics",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Кинематика и динамика",
    "class": "10-11",
    "level": "medium",
    "description": "Движение тел под углом к горизонту, движение по наклонной плоскости.",
    "tasks": [
      {
        "id": "phys-10-kd-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Тело брошено вертикально вверх с начальной скоростью 20 м/с. На какую максимальную высоту в метрах оно поднимется? g = 10 м/с².</p>",
        "answer": "20",
        "unit": "м"
      },
      {
        "id": "phys-10-kd-2",
        "num": 2,
        "title": "Задача 2",
        "text": "<p class=\"task-text\">Брусок соскальзывает без трения по наклонной плоскости с углом 30° к горизонту. Найдите ускорение бруска в м/с², если g = 10 м/с², sin 30° = 0,5.</p>",
        "answer": "5",
        "unit": "м/с²"
      }
    ]
  },
  {
    "id": "phys-10-conservation",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Законы сохранения в механике",
    "class": "10-11",
    "level": "hard",
    "description": "Абсолютно неупругие и упругие соударения, преобразования потенциальной и кинетической энергий.",
    "tasks": [
      {
        "id": "phys-10-c-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">Пружинный пистолет выстреливает шарик массой 10 г (0,01 кг) вертикально вверх на высоту 5 м. Какова потенциальная энергия деформированной пружины перед выстрелом в джоулях? g = 10 м/с².</p>",
        "answer": "0.5",
        "acceptedAnswers": [
          "0.5",
          "0,5"
        ],
        "unit": "Дж"
      }
    ]
  },
  {
    "id": "phys-10-electrostatics",
    "subject": "physics",
    "subjectLabel": "Физика",
    "title": "Электростатическое поле",
    "class": "10-11",
    "level": "hard",
    "description": "Закон Кулона, напряжённость электрического поля и потенциал.",
    "tasks": [
      {
        "id": "phys-10-es-1",
        "num": 1,
        "title": "Задача 1",
        "text": "<p class=\"task-text\">На точечный заряд 2 · 10⁻⁸ Кл в электрическом поле действует сила 6 · 10⁻⁴ Н. Найдите напряжённость электрического поля в этой точке (E = F/q) в В/м (или Н/Кл).</p>",
        "answer": "30000",
        "unit": "В/м"
      }
    ]
  }
];

  return {
    topics: TOPICS,
    getTopicById: function(id) {
      if (!id) return null;
      return TOPICS.find(t => t.id === id) || null;
    },
    getTopicsBySubject: function(subject) {
      if (!subject) return TOPICS;
      return TOPICS.filter(t => t.subject === subject);
    },
    getTopicsByClass: function(classVal) {
      if (!classVal) return TOPICS;
      return TOPICS.filter(t => t.class === classVal);
    }
  };

}));
