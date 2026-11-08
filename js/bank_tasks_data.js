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
          "Упорядоченное прямолинейное движение молекул от нагретого края тела к холодному",
          "Колебания электронов вокруг ядер атомов исключительно при нагревании выше 100 °C",
          "Непрерывное и беспорядочное (хаотическое) движение частиц, из которых состоит вещество",
          "Движение тела в пространстве под действием силы тяжести"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "В жидком состоянии",
          "Скорость диффузии строго одинакова во всех трёх состояниях",
          "В твёрдом кристаллическом состоянии",
          "В газообразном состоянии"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "0 Дж",
          "450 Дж",
          "225 Дж",
          "900 Дж"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Место сгиба нагрелось исключительно за счёт тепла пальцев рук",
          "Из-за резкого сжатия окружающего воздуха вблизи места сгиба",
          "Внешняя механическая работа по деформации кристаллической решётки перешла во внутреннюю энергию проволоки",
          "При сгибании из меди выделился статический электрический заряд"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Температуру тела в градусах Цельсия",
          "Количество теплоты, переданное телу извне",
          "Удельную теплоёмкость вещества тела",
          "Полную начальную внутреннюю энергию тела"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "На 280 000 Дж",
          "На 300 Дж",
          "На 700 Дж",
          "На 1100 Дж"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Перенос энергии электромагнитным излучением; невозможна в газах",
          "Перенос энергии без перемещения вещества; невозможна в жидкостях",
          "Перенос энергии струями и потоками вещества; невозможна в твёрдых телах и вакууме",
          "Механическое перемешивание вещества; невозможна в воздухе"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Распушенные перья лучше поглощают ультрафиолетовое излучение ночного неба",
          "Между перьями задерживается воздух, обладающий крайне низкой теплопроводностью, что уменьшает теплопотери",
          "Распушенные перья увеличивают общую массу птицы и сохраняют механическую энергию",
          "Так птица обеспечивает интенсивное охлаждение внутренних органов"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Температура тела не зависит от скорости хаотического движения молекул",
          "При повышении температуры средняя кинетическая энергия теплового движения молекул уменьшается",
          "Температура тела определяется исключительно потенциальной энергией взаимодействия молекул"
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
          "300 Дж",
          "3 Дж",
          "15 Дж",
          "30 Дж"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Теплопроводностью космической пыли",
          "Тепловым излучением (электромагнитными волнами)",
          "Диффузией атомов водорода",
          "Конвекцией солнечного газа"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Тёмная краска химически реагирует с молоком через сталь цистерны",
          "Белая краска обладает максимальной теплопроводностью и охлаждает цистерну",
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
          "Увеличилась на 250 Дж",
          "Увеличилась на 850 Дж",
          "Увеличилась на 350 Дж",
          "Уменьшилась на 350 Дж"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Полное количество теплоты, содержащееся в одном кубическом метре вещества",
          "Количество теплоты, необходимое для нагревания 1 кг вещества на 1 °C",
          "Количество теплоты, выделяющееся при полном сгорании 1 кг топлива",
          "Температуру, при которой вещество полностью переходит в газообразное состояние"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Дж / кг",
          "Вт / (кг · °C)",
          "Дж · кг · °C",
          "Дж / (кг · °C)"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Q = λ · m",
          "Q = m · (t₂ − t₁) / c",
          "Q = c · m / (t₂ − t₁)"
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
          "56 кДж (56 000 Дж)",
          "4 кДж (4 000 Дж)",
          "40 кДж (40 000 Дж)",
          "20 кДж (20 000 Дж)"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Плотность солёной морской воды выше плотности пресной воды",
          "Над водной поверхностью полностью отсутствует тепловое излучение",
          "Морская вода отражает 100% солнечного света обратно в космос",
          "Вода обладает огромной удельной теплоёмкостью (4200 Дж/(кг·°C)), медленно прогревается днём/летом и медленно остывает ночью/зимой"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "135 кДж (135 000 Дж)",
          "270 кДж (270 000 Дж)",
          "54 кДж (54 000 Дж)",
          "540 кДж (540 000 Дж)"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Q = c · m · g",
          "Q<sub>полученное</sub> − Q<sub>отданное</sub> = m · g · h",
          "Q<sub>полученное</sub> = Q<sub>отданное</sub> (алгебраическая сумма всех Q = 0)",
          "Q<sub>полученное</sub> · Q<sub>отданное</sub> = 1"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "100 °C",
          "60 °C",
          "40 °C"
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
          "Ни одна жидкость не нагреется без предварительного закипания",
          "Обе жидкости нагреются строго за одинаковое время",
          "Вода, так как её плотность больше плотности масла",
          "Подсолнечное масло, так как его удельная теплоёмкость почти в 2,5 раза меньше"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Зависит только от площади поперечного сечения изделия",
          "Да, у слитка теплоёмкость больше, так как его масса в 10 000 раз больше",
          "Да, у монеты теплоёмкость больше, так как она нагревается быстрее"
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
          "950 Дж / (кг · °C)",
          "190 Дж / (кг · °C)",
          "380 Дж / (кг · °C)",
          "760 Дж / (кг · °C)"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Вода в обоих стаканах нагреется до абсолютно одинаковой температуры",
          "В стакане с алюминиевой ложкой, так как её удельная теплоёмкость почти в 4 раза выше",
          "Вода не нагреется ни в одном стакане",
          "В стакане с серебряной ложкой, так как серебро благородный металл"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "m = Q · c / Δt",
          "m = Q · c · Δt",
          "m = c · Δt / Q",
          "m = Q / (c · Δt)"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "336 кДж",
          "672 кДж",
          "840 кДж",
          "168 кДж"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Скорость испарения жидкости пропорциональна внешнему атмосферному давлению",
          "Сила трения скольжения пропорциональна квадрату относительной скорости движения",
          "Внутренняя энергия газа прямо пропорциональна кубу его объёма",
          "Мощность теплоотдачи тела пропорциональна площади поверхности и разности температур тела и окружающей среды"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Коэффициент поверхностного натяжения",
          "Удельную теплоёмкость вещества",
          "Коэффициент теплоотдачи",
          "Коэффициент полезного действия радиатора"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Вт · м² / °C",
          "Вт / (м² · °C) [или Вт / (м² · К)]",
          "Па / м²",
          "Дж / (кг · °C)"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "50 Вт",
          "300 Вт",
          "1050 Вт"
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
          "Рёбра снижают общую массу изделия и тем самым уменьшают теплоёмкость",
          "Рёбра полностью блокируют движение воздуха возле процессора",
          "Множество рёбер многократно увеличивает площадь поверхности S, что резко повышает мощность отвода тепла P",
          "Рёбра охлаждают окружающий воздух за счёт химической реакции"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "24 Вт / (м² · °C)",
          "8 Вт / (м² · °C)",
          "1,2 Вт / (м² · °C)",
          "15 Вт / (м² · °C)"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "q = P / t — это скорость изменения мощности во времени",
          "q — это масса тепла, переносимого молекулами за секунду",
          "q = P · S — это произведение мощности на площадь"
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
          "Вт · м²",
          "Вт / м²",
          "Дж / (кг · м²)",
          "Дж / с²"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Движущийся воздух уменьшает удельную теплоёмкость чая",
          "Движение воздуха охлаждает чашку за счёт замедления молекул чая",
          "Вынужденное движение воздуха сдувает приграничный прогретый слой, резко увеличивая коэффициент теплоотдачи α и испарение",
          "Обдув уменьшает площадь открытой поверхности кружки"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "90 °C",
          "50 °C",
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
          "Всегда от окружающей среды к телу независимо от их температур",
          "Теплота передаётся в обоих направлениях строго в равных количествах",
          "Направление передачи энергии зависит только от площади поверхности тела",
          "Всегда от поверхности с более высокой температурой к среде с более низкой температурой"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Уменьшится в 3 раза",
          "Увеличится в 3 раза",
          "Не изменится, так как плотность потока q = α · ΔT зависит только от α и разности температур",
          "Увеличится в 9 раз"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "120 Вт",
          "30 Вт"
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
          "Температура металла на улице всегда на 10 градусов ниже температуры дерева",
          "Дерево вырабатывает собственное тепло благодаря трению волокон",
          "Металл излучает отрицательную тепловую энергию",
          "Металл обладает огромной теплопроводностью и вызывает высокий коэффициент теплоотдачи от кожи руки, стремительно забирая тепло"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "90 Дж",
          "27 000 Дж (27 кДж)",
          "180 000 Дж (180 кДж)",
          "9 000 Дж (9 кДж)"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Переход газа в жидкое состояние при охлаждении",
          "Переход жидкости в газообразное состояние при нагревании",
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
          "Температура хаотически колеблется вверх и вниз",
          "Температура остаётся строго постоянной и равной температуре плавления",
          "Температура непрерывно возрастает прямо пропорционально подводимому теплу",
          "Температура сначала падает до абсолютного нуля, затем возрастает"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "На увеличение скорости поступательного движения молекул (рост кинетической энергии)",
          "На ионизацию атомов и ядерные реакции в веществе",
          "Энергия полностью уходит в виде теплового излучения в пространство",
          "На преодоление сил притяжения между частицами и разрушение кристаллической решётки (рост потенциальной энергии)"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Q = L · m",
          "Q = c · m · Δt",
          "Q = λ · m",
          "Q = q · m"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Дж · кг",
          "Дж / кг",
          "Вт / кг",
          "Дж / (кг · °C)"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "82,5 кДж",
          "660 кДж"
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
          "Переход пара в капли жидкости",
          "Выпадение хлопьев в химическом растворе",
          "Остывание твёрдого кристалла без смены фазового состояния",
          "Переход вещества из жидкого состояния в твёрдое кристаллическое"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Сначала поглощается, а в самом конце резко выделяется",
          "Энергия поглощается жидкостью из окружающей среды",
          "Энергия выделяется в окружающую среду в количестве Q = λ · m",
          "Энергия не выделяется и не поглощается"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "100 кДж / кг",
          "25 кДж / кг (25 000 Дж/кг)",
          "12,5 кДж / кг",
          "50 кДж / кг"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Вся вода в термосе полностью замёрзнет в монолитный лёд",
          "Температура системы опустится ниже нуля градусов",
          "Весь лёд мгновенно растает за счёт кинетической энергии струи",
          "Количество льда и воды останется неизменным: лёд не растает, а вода не замёрзнет"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "141 кДж",
          "23 кДж",
          "82 кДж",
          "59 кДж"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Нагревание образовавшейся жидкости",
          "Нагревание твёрдого тела до температуры плавления",
          "Остывание нагретого кристалла"
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
          "Аморфные тела в принципе не способны переходить в жидкое состояние",
          "Аморфные тела плавятся при строго постоянной температуре без размягчения",
          "У аморфных тел нет фиксированной температуры плавления: они размягчаются постепенно в широком температурном интервале",
          "При нагревании аморфные тела всегда самопроизвольно кристаллизуются"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "4 кг",
          "1,5 кг",
          "0,5 кг",
          "2 кг"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Лёд в чанах отражает холод обратно в форточки",
          "При замерзании вода кристаллизуется и выделяет колоссальное количество теплоты (330 кДж на каждый кг), согревая воздух",
          "Вода химически поглощает холодный воздух",
          "Замёрзшая вода притягивает инфракрасное излучение луны"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "При испарении тепло выделяется, а при кипении поглощается",
          "Испарение возможно только у воды, а кипение — у любых органических жидкостей",
          "Испарение идёт с открытой поверхности жидкости при любой температуре, а кипение — по всему объёму при строго определённой температуре кипения",
          "Испарение происходит только при 100 °C, а кипение — при любой температуре выше нуля"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "При испарении молекулы внутри жидкости полностью останавливаются",
          "Образующийся пар давит на жидкость сверху и охлаждает её давлением",
          "Молекулы пара уносят с собой силу тяжести жидкости",
          "Жидкость покидают наиболее быстрые молекулы с наибольшей кинетической энергией, поэтому средняя кинетическая энергия оставшихся частиц падает"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "От плотности дна сосуда и освещённости комнаты",
          "Только от глубины сосуда и атмосферного давления",
          "Только от толщины стенок сосуда"
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
          "Q = c · m · Δt",
          "Q = L · m",
          "Q = λ · m",
          "Q = q · m"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Вт / м²",
          "Дж / (кг · °C)",
          "Дж · кг",
          "Дж / кг"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "0,77 МДж (770 000 Дж)",
          "2,3 МДж (2 300 000 Дж)",
          "4,6 МДж (4 600 000 Дж)"
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
          "Состояние, при котором испарение жидкости полностью прекращается",
          "Состояние, когда температура пара становится выше температуры жидкости",
          "Состояние, при котором число молекул, вылетающих из жидкости за 1 секунду, равно числу молекул пара, возвращающихся обратно в жидкость",
          "Состояние, когда плотность пара становится равной плотности жидкости"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Пар, содержащий взвешенные капельки пыли и солей",
          "Пар, находящийся в состоянии динамического равновесия со своей жидкостью",
          "Любой пар, невидимый человеческому глазу",
          "Пар, нагретый до температуры свыше 250 °C"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "Пар растворяет верхний слой клеток за счёт кислотности",
          "Молекулы пара обладают ядовитыми химическими свойствами"
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
          "8 кг",
          "2 кг",
          "4 кг",
          "21,16 кг"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Вода в горах вообще теряет способность кипеть",
          "Понижается (вода закипает при температуре ниже 100 °C)",
          "Повышается (вода закипает при температуре выше 100 °C)",
          "Остаётся строго неизменной и равной 100 °C на любой высоте"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "2300 кДж (2,3 МДж)",
          "336 кДж (0,336 МДж)",
          "1964 кДж",
          "2636 кДж (2,636 МДж)"
        ],
        "correctIndex": 3,
        "answer": "4",
        "acceptedAnswers": [
          "4",
          "3",
          "г",
          "d",
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
          "Герметичная крышка генерирует ультразвук, разрушающий пищу",
          "В скороварке вода испаряется в 5 раз быстрее",
          "Пар не выходит наружу, давление внутри растёт, и вода кипит при повышенной температуре (115–120 °C)",
          "В скороварке ускоряется броуновское движение продуктов за счёт давления"
        ],
        "correctIndex": 2,
        "answer": "3",
        "acceptedAnswers": [
          "3",
          "2",
          "в",
          "c",
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
          "Испарение жидкости с открытой водной глади",
          "Переход вещества из газообразного (парообразного) состояния в жидкое",
          "Растворение твёрдого кристалла в воде",
          "Превращение жидкости в твёрдый кристаллический лёд"
        ],
        "correctIndex": 1,
        "answer": "2",
        "acceptedAnswers": [
          "2",
          "1",
          "б",
          "b",
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
          "3,2 кг",
          "0,5 кг"
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
  "id": "phys-8-heat-all",
  "subject": "physics",
  "subjectLabel": "Физика",
  "title": "Задачи на теплоту (нагрев, сгорание, плавление, тепловой баланс)",
  "class": "8",
  "level": "hard",
  "description": "19 расчётных и комбинированных задач: нагрев и охлаждение, КПД и сгорание топлива, фазовые переходы, уравнение теплового баланса и закон Ньютона–Рихмана.",
  "tasks": [
    {
      "id": "phys-8-heat-1",
      "num": 1,
      "title": "Нагревание воды в аквариуме",
      "type": "Нагрев",
      "text": "<p class=\"task-text\">Какое количество теплоты требуется для нагревания воды в аквариуме объемом <strong>5 л</strong> от <strong>10 °C</strong> до <strong>60 °C</strong>?<br>(Плотность воды: ρ = 1000 кг/м³, удельная теплоемкость воды: c = 4200 Дж/(кг·°C)). Ответ выразите в <strong>МДж</strong>.</p>",
      "answer": "1.05",
      "unit": "МДж",
      "acceptedAnswers": [
        "1.05",
        "1,05",
        "1050000",
        "1050 кДж",
        "1.05 МДж"
      ],
      "explanation": "1. Масса воды: m = ρ · V = 1000 кг/м³ · 0,005 м³ = 5 кг.<br>2. Количество теплоты: Q = c · m · (t₂ − t₁) = 4200 · 5 · (60 − 10) = 4200 · 5 · 50 = 1 050 000 Дж = <strong>1,05 МДж</strong>."
    },
    {
      "id": "phys-8-heat-2",
      "num": 2,
      "title": "Сгорание сухого спирта в горелке",
      "type": "Нагрев + КПД + Сгорание",
      "text": "<p class=\"task-text\">Какую массу сухого спирта нужно сжечь в горелке с КПД <strong>40%</strong>, чтобы нагреть <strong>2 кг</strong> воды от <strong>20 °C</strong> до кипения при <strong>100 °C</strong>?<br>(Удельная теплота сгорания спирта: q = 30 000 000 Дж/кг, c = 4200 Дж/(кг·°C)). Ответ дайте в <strong>граммах</strong>.</p>",
      "answer": "56",
      "unit": "г",
      "acceptedAnswers": [
        "56",
        "0.056",
        "0,056",
        "56 г"
      ],
      "explanation": "1. Полезное тепло: Q_полез = c · m_в · Δt = 4200 · 2 · 80 = 672 000 Дж.<br>2. Полное тепло сгорания топлива: Q_затр = Q_полез / η = 672 000 / 0,4 = 1 680 000 Дж.<br>3. Масса спирта: m = Q_затр / q = 1 680 000 / 30 000 000 = 0,056 кг = <strong>56 г</strong>."
    },
    {
      "id": "phys-8-heat-3",
      "num": 3,
      "title": "Нагревание и плавление льда",
      "type": "Нагрев + Плавление",
      "text": "<p class=\"task-text\">Какое количество теплоты нужно затратить, чтобы кусок льда массой <strong>0,5 кг</strong> при температуре <strong>-10 °C</strong> превратить в воду при температуре <strong>0 °C</strong>?<br>(Удельная теплоемкость льда: c = 2100 Дж/(кг·°C), удельная теплота плавления: λ = 330 000 Дж/кг). Ответ дайте в <strong>кДж</strong>.</p>",
      "answer": "175.5",
      "unit": "кДж",
      "acceptedAnswers": [
        "175.5",
        "175,5",
        "175500",
        "175.5 кДж"
      ],
      "explanation": "1. Нагрев льда до 0 °C: Q₁ = c · m · (0 − (-10)) = 2100 · 0,5 · 10 = 10 500 Дж.<br>2. Плавление льда при 0 °C: Q₂ = λ · m = 330 000 · 0,5 = 165 000 Дж.<br>3. Суммарная теплота: Q = Q₁ + Q₂ = 10 500 + 165 000 = 175 500 Дж = <strong>175,5 кДж</strong>."
    },
    {
      "id": "phys-8-heat-4",
      "num": 4,
      "title": "Удельная теплоемкость цилиндра в воде",
      "type": "Уравнение теплового баланса",
      "text": "<p class=\"task-text\">Металлический цилиндр массой <strong>0,2 кг</strong>, нагретый до <strong>100 °C</strong>, опустили в воду массой <strong>0,38 кг</strong> при <strong>20 °C</strong>. Установилась общая температура <strong>24 °C</strong>. Найдите удельную теплоемкость металла в <strong>Дж/(кг·°C)</strong>.<br>(c_воды = 4200 Дж/(кг·°C)).</p>",
      "answer": "420",
      "unit": "Дж/(кг·°C)",
      "acceptedAnswers": [
        "420",
        "420 Дж/(кг·°C)"
      ],
      "explanation": "1. Отдано металлом: Q_отд = c₁ · 0,2 · (100 − 24) = 15,2 · c₁.<br>2. Получено водой: Q_пол = 4200 · 0,38 · (24 − 20) = 6384 Дж.<br>3. По закону теплового баланса: 15,2 · c₁ = 6384 => c₁ = 6384 / 15,2 = <strong>420 Дж/(кг·°C)</strong>."
    },
    {
      "id": "phys-8-heat-5",
      "num": 5,
      "title": "Таяние куска льда в тёплой воде",
      "type": "Уравнение теплового баланса + Нагрев + Плавление",
      "text": "<p class=\"task-text\">В воду массой <strong>1 кг</strong> при <strong>20 °C</strong> бросили кусок льда массой <strong>0,2 кг</strong> при <strong>0 °C</strong>. Какая конечная температура смеси установится в <strong>°C</strong>? Растает ли весь лед?<br>(c = 4200 Дж/(кг·°C), λ = 330 000 Дж/кг). Округлите до десятых.</p>",
      "answer": "3.6",
      "unit": "°C",
      "acceptedAnswers": [
        "3.6",
        "3,6",
        "3.57",
        "3,57",
        "3.6 °C"
      ],
      "explanation": "1. Максимальное тепло остывания воды до 0 °C: Q_отд = 4200 · 1 · 20 = 84 000 Дж.<br>2. Тепло плавления всего льда: Q_пл = 330 000 · 0,2 = 66 000 Дж. Так как 84 000 > 66 000 Дж, весь лед гарантированно растает.<br>3. Тепловой баланс: 4200 · 1 · (20 − t) = 66 000 + 4200 · 0,2 · t => 84 000 − 4200 t = 66 000 + 840 t => 5040 t = 18 000 => t ≈ <strong>3,6 °C</strong>."
    },
    {
      "id": "phys-8-heat-6",
      "num": 6,
      "title": "Время закипания электрочайника",
      "type": "Ток + КПД + Нагрев",
      "text": "<p class=\"task-text\">Чайник мощностью <strong>2000 Вт</strong> с КПД <strong>84%</strong> нагревает <strong>1,5 кг</strong> воды от <strong>20 °C</strong> до <strong>100 °C</strong>. За сколько <strong>секунд</strong> закипит вода?<br>(c = 4200 Дж/(кг·°C)).</p>",
      "answer": "300",
      "unit": "с",
      "acceptedAnswers": [
        "300",
        "300 с",
        "5 мин"
      ],
      "explanation": "1. Полезное тепло: Q_полез = 4200 · 1,5 · 80 = 504 000 Дж.<br>2. Полная электроэнергия: A = Q_полез / η = 504 000 / 0,84 = 600 000 Дж.<br>3. Время работы чайника: t = A / P = 600 000 / 2000 = <strong>300 с</strong> (5 минут)."
    },
    {
      "id": "phys-8-heat-7",
      "num": 7,
      "title": "Нагревание пули при ударе о вал",
      "type": "Энергия + Нагрев",
      "text": "<p class=\"task-text\">Свинцовая пуля летит со скоростью <strong>200 м/с</strong> и застревает в земляном валу. На сколько градусов Цельсия нагрелась пуля, если <strong>70%</strong> ее кинетической энергии превратилось во внутреннюю энергию самой пули?<br>(c = 140 Дж/(кг·°C)).</p>",
      "answer": "100",
      "unit": "°C",
      "acceptedAnswers": [
        "100",
        "100 °C",
        "100°C"
      ],
      "explanation": "1. Теплота, перешедшая в пулю: Q = 0,7 · (m · v²) / 2 = 0,35 · m · v².<br>2. Теплота нагрева пули: Q = c · m · Δt.<br>3. Приравниваем: c · Δt = 0,35 · v² => Δt = (0,35 · 200²) / 140 = 14 000 / 140 = <strong>100 °C</strong>."
    },
    {
      "id": "phys-8-heat-8",
      "num": 8,
      "title": "Конденсация пара и охлаждение воды",
      "type": "Конденсация + Охлаждение",
      "text": "<p class=\"task-text\">Какое количество теплоты выделится в окружающую среду при конденсации <strong>2 кг</strong> водяного пара при <strong>100 °C</strong> и последующем охлаждении образовавшейся воды до <strong>20 °C</strong>?<br>(L = 2 300 000 Дж/кг, c = 4200 Дж/(кг·°C)). Ответ выразите в <strong>МДж</strong> с точностью до тысячных.</p>",
      "answer": "5.272",
      "unit": "МДж",
      "acceptedAnswers": [
        "5.272",
        "5,272",
        "5.27",
        "5,27",
        "5272000"
      ],
      "explanation": "1. Конденсация пара при 100 °C: Q₁ = L · m = 2 300 000 · 2 = 4 600 000 Дж (4,6 МДж).<br>2. Охлаждение воды от 100 °C до 20 °C: Q₂ = 4200 · 2 · 80 = 672 000 Дж (0,672 МДж).<br>3. Общее тепло: Q = Q₁ + Q₂ = 4 600 000 + 672 000 = 5 272 000 Дж = <strong>5,272 МДж</strong>."
    },
    {
      "id": "phys-8-heat-9",
      "num": 9,
      "title": "Впуск водяного пара в холодную воду",
      "type": "Уравнение теплового баланса + Нагрев + Парообразование",
      "text": "<p class=\"task-text\">В сосуд с холодной водой массой <strong>5 кг</strong> при <strong>20 °C</strong> впустили <strong>100 г</strong> водяного пара при <strong>100 °C</strong>. До какой температуры (в <strong>°C</strong>) нагреется вода после полной конденсации пара и перемешивания? Потерями тепла пренебречь.<br>(L = 2 300 000 Дж/кг, c = 4200 Дж/(кг·°C)). Округлите до десятых.</p>",
      "answer": "32.3",
      "unit": "°C",
      "acceptedAnswers": [
        "32.3",
        "32,3",
        "32.3 °C"
      ],
      "explanation": "1. Отдано паром: Q_отд = 0,1 · 2 300 000 + 4200 · 0,1 · (100 − t) = 230 000 + 42 000 − 420 t = 272 000 − 420 t.<br>2. Получено водой: Q_пол = 4200 · 5 · (t − 20) = 21 000 t − 420 000.<br>3. Баланс: 272 000 + 420 000 = 21 420 t => 692 000 = 21 420 t => t ≈ <strong>32,3 °C</strong>."
    },
    {
      "id": "phys-8-heat-10",
      "num": 10,
      "title": "Кастрюля со льдом на газовой горелке",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">В алюминиевую кастрюлю массой <strong>0,5 кг</strong> положили <strong>1,5 кг</strong> льда при <strong>-10 °C</strong>. Кастрюлю поставили на газовую горелку с КПД <strong>60%</strong>. Сколько <strong>граммов</strong> природного газа (q = 44 МДж/кг) потребуется сжечь, чтобы лед растаял, вода закипела, а <strong>200 г</strong> воды обратилось в пар?<br>(c_ал = 920, c_льда = 2100, λ = 330 000, c_воды = 4200, L = 2,3 МДж/кг).</p>",
      "answer": "63",
      "unit": "г",
      "acceptedAnswers": [
        "63",
        "0.063",
        "0,063",
        "63 г"
      ],
      "explanation": "1. Нагрев кастрюли от -10 до 100 °C: Q_к = 0,5 · 920 · 110 = 50 600 Дж.<br>2. Нагрев льда: Q₁ = 1,5 · 2100 · 10 = 31 500 Дж.<br>3. Плавление льда: Q₂ = 1,5 · 330 000 = 495 000 Дж.<br>4. Нагрев воды: Q₃ = 1,5 · 4200 · 100 = 630 000 Дж.<br>5. Парообразование 200 г: Q₄ = 0,2 · 2 300 000 = 460 000 Дж.<br>Q_полез = 1 667 100 Дж. Q_затр = Q_полез / 0,6 ≈ 2 778 500 Дж.<br>m_газа = 2 778 500 / 44 000 000 ≈ 0,0631 кг = <strong>63 г</strong>."
    },
    {
      "id": "phys-8-heat-11",
      "num": 11,
      "title": "Вода, лед и пар в медном калориметре",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">В медный калориметр массой <strong>300 г</strong> с <strong>400 г</strong> воды и <strong>100 г</strong> льда при <strong>0 °C</strong> впускают <strong>50 г</strong> водяного пара при <strong>100 °C</strong>. Найдите установившуюся температуру смеси в <strong>°C</strong>.<br>(c_меди = 380, c_воды = 4200, λ = 330 000, L = 2 300 000 Дж/кг). Округлите до десятых.</p>",
      "answer": "42.5",
      "unit": "°C",
      "acceptedAnswers": [
        "42.5",
        "42,5",
        "43",
        "42.5 °C"
      ],
      "explanation": "1. Конденсация 50 г пара выделяет: 0,05 · 2,3 · 10⁶ = 115 000 Дж.<br>2. Плавление 100 г льда требует: 0,1 · 330 000 = 33 000 Дж.<br>3. Остаток 82 000 Дж + охлаждение 50 г воды от пара: 82 000 + 0,05 · 4200 · (100 − t) = (0,4 + 0,1) · 4200 · t + 0,3 · 380 · t => 103 000 = 2424 t => t ≈ <strong>42,5 °C</strong>."
    },
    {
      "id": "phys-8-heat-12",
      "num": 12,
      "title": "Выкипание воды спиртовкой с теплопотерями",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">Цилиндрический сосуд площадью <strong>0,25 м²</strong> наполнен кипящей водой при <strong>100 °C</strong> в помещении с <strong>20 °C</strong>. Коэффициент теплоотдачи к воздуху <strong>15 Вт/(м²·К)</strong>. Подогревается спиртовкой с КПД <strong>40%</strong>, сжигающей <strong>3 г</strong> спирта в минуту (q = 30 МДж/кг). Какая масса воды в <strong>граммах</strong> выкипит за <strong>20 минут</strong>?<br>(L = 2,3 МДж/кг).</p>",
      "answer": "157",
      "unit": "г",
      "acceptedAnswers": [
        "157",
        "0.157",
        "0,157",
        "157 г"
      ],
      "explanation": "1. Теплопотери через стенки: P_пот = α · S · ΔT = 15 · 0,25 · 80 = 300 Вт.<br>2. Тепловая мощность спиртовки: расход 3 г/мин = 0,05 г/с. P_полн = 0,00005 · 30 000 000 = 1500 Вт.<br>3. Полезная мощность: P_подв = 1500 · 0,4 = 600 Вт.<br>4. На парообразование: P_исп = 600 − 300 = 300 Вт.<br>5. За 20 минут (1200 с): Q_исп = 300 · 1200 = 360 000 Дж. Масса пара: m = 360 000 / 2 300 000 ≈ 0,1565 кг = <strong>157 г</strong>."
    },
    {
      "id": "phys-8-heat-13",
      "num": 13,
      "title": "Смешивание воды при 15 °C и льда при -30 °C",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">В сосуд с <strong>500 г</strong> воды при <strong>15 °C</strong> бросают кусок льда массой <strong>600 г</strong> при <strong>-30 °C</strong>. Какая температура (в <strong>°C</strong>) установится в сосуде при тепловом равновесии?<br>(c_воды = 4200, c_льда = 2100, λ = 330 000 Дж/кг).</p>",
      "answer": "0",
      "unit": "°C",
      "acceptedAnswers": [
        "0",
        "0 °C",
        "0°C",
        "ноль"
      ],
      "explanation": "1. Теплота, которую отдаст вода при остывании до 0 °C: Q_воды = 0,5 · 4200 · 15 = 31 500 Дж.<br>2. Теплота, необходимая для нагрева льда до 0 °C: Q_льда = 0,6 · 2100 · 30 = 37 800 Дж.<br>3. Так как 37 800 > 31 500 Дж, вода охладится до 0 °C, и часть воды (19 г) замёрзнет. Установившаяся температура равна <strong>0 °C</strong>."
    },
    {
      "id": "phys-8-heat-14",
      "num": 14,
      "title": "Замерзание открытого бассейна на морозе",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">Открытый бассейн площадью <strong>10 м²</strong> заполнен водой при <strong>0 °C</strong>. Температура воздуха <strong>-15 °C</strong>. Коэффициент теплоотдачи от поверхности к воздуху <strong>22 Вт/(м²·К)</strong>. Какой массы лед в <strong>кг</strong> образуется на поверхности бассейна за <strong>5 часов</strong>?<br>(λ = 330 000 Дж/кг).</p>",
      "answer": "180",
      "unit": "кг",
      "acceptedAnswers": [
        "180",
        "180 кг"
      ],
      "explanation": "1. Мощность теплоотдачи с зеркала воды: P = α · S · ΔT = 22 · 10 · 15 = 3300 Вт.<br>2. За 5 часов (18 000 с) выделится теплота: Q = 3300 · 18 000 = 59 400 000 Дж = 59,4 МДж.<br>3. Масса образовавшегося льда: m = Q / λ = 59 400 000 / 330 000 = <strong>180 кг</strong>."
    },
    {
      "id": "phys-8-heat-15",
      "num": 15,
      "title": "Закалка раскаленной стальной детали",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">Стальную деталь массой <strong>4 кг</strong> при <strong>850 °C</strong> опускают для закалки в бак с <strong>5 кг</strong> воды при <strong>20 °C</strong>. При погружении <strong>100 г</strong> воды мгновенно обратились в пар при 100 °C и улетучились. До какой температуры (в <strong>°C</strong>) нагрелась оставшаяся вода?<br>(c_стали = 500, c_воды = 4200, L = 2 300 000 Дж/кг). Округлите до десятых.</p>",
      "answer": "82.9",
      "unit": "°C",
      "acceptedAnswers": [
        "82.9",
        "82,9",
        "83",
        "82.9 °C"
      ],
      "explanation": "1. Энергия на нагрев и испарение 100 г воды: Q_исп = 0,1 · 4200 · 80 + 0,1 · 2 300 000 = 33 600 + 230 000 = 263 600 Дж.<br>2. Нагрев оставшихся 4,9 кг воды: Q_воды = 4,9 · 4200 · (t − 20) = 20 580 t − 411 600.<br>3. Остывание детали: Q_стали = 4 · 500 · (850 − t) = 1 700 000 − 2000 t.<br>4. 1 700 000 − 2000 t = 263 600 + 20 580 t − 411 600 => 22 580 t = 1 848 000 => t ≈ <strong>82,9 °C</strong>."
    },
    {
      "id": "phys-8-heat-16",
      "num": 16,
      "title": "Плавление свинца в печи с теплопотерями",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">В печи плавят <strong>50 кг</strong> свинца при <strong>27 °C</strong> (t_пл = 327 °C). Плавление длилось <strong>30 минут</strong>. Теплопотери через стенки печи в цех (27 °C): S = 1,5 м², α = 20 Вт/(м²·К). Сколько <strong>граммов</strong> каменного угля (q = 30 МДж/кг) сожжено, если КПД топки <strong>80%</strong>?<br>(c_св = 130, λ_св = 25 000 Дж/кг).</p>",
      "answer": "891",
      "unit": "г",
      "acceptedAnswers": [
        "891",
        "0.891",
        "0,891",
        "891 г"
      ],
      "explanation": "1. Нагрев свинца: Q₁ = 50 · 130 · 300 = 1 950 000 Дж.<br>2. Плавление свинца: Q₂ = 50 · 25 000 = 1 250 000 Дж.<br>3. Теплопотери за 30 мин (1800 с): Q_пот = α · S · ΔT · t = 20 · 1,5 · 300 · 1800 = 16 200 000 Дж.<br>4. Суммарно полезное тепло: Q_пол = 1 950 000 + 1 250 000 + 16 200 000 = 19 400 000 Дж.<br>5. С учетом КПД 80%: Q_затр = 19 400 000 / 0,8 = 24 250 000 Дж.<br>6. Масса угля: m = 24 250 000 / 30 000 000 ≈ 0,891 кг = <strong>891 г</strong>."
    },
    {
      "id": "phys-8-heat-17",
      "num": 17,
      "title": "Температура стенок чугунного радиатора",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">Чугунный паровой радиатор площадью <strong>2 м²</strong> находится в комнате с температурой <strong>20 °C</strong>. В радиатор непрерывно подается водяной пар при <strong>100 °C</strong> со скоростью <strong>1,2 кг/ч</strong>. Вода вытекает при температуре стенок T. Коэффициент теплоотдачи к воздуху <strong>10 Вт/(м²·К)</strong>. Найдите установившуюся температуру стенок T в <strong>°C</strong>.<br>(L = 2 300 000, c = 4200 Дж/(кг·°C)).</p>",
      "answer": "61",
      "unit": "°C",
      "acceptedAnswers": [
        "61",
        "61 °C",
        "61°C"
      ],
      "explanation": "1. Расход пара в секунду: m = 1,2 / 3600 = 1/3000 кг/с.<br>2. Теплоотдача радиатора: P_отд = 10 · 2 · (T − 20) = 20(T − 20).<br>3. Тепловыделение конденсации и охлаждения воды: P_прих = [2 300 000 + 4200(100 − T)] / 3000.<br>4. Приравниваем: 60 000(T − 20) = 2 720 000 − 4200 T => 64 200 T = 3 920 000 => T ≈ <strong>61 °C</strong>."
    },
    {
      "id": "phys-8-heat-18",
      "num": 18,
      "title": "Свинцовая пуля в сугробе льда",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">Свинцовая пуля со скоростью <strong>400 м/с</strong> застревает в сугробе льда при <strong>0 °C</strong>. <strong>50%</strong> механической энергии пошло на нагрев пули и льда. Температура пули при ударе равна <strong>327 °C</strong>, причем <strong>20%</strong> массы пули уже расплавилось. Определите отношение массы растаявшего льда к массе пули (m_льда / m_пули).<br>(λ_св = 25 000, c_св = 140, λ_льда = 330 000 Дж/кг). Округлите до тысячных.</p>",
      "answer": "0.275",
      "unit": "безразмерная величина",
      "acceptedAnswers": [
        "0.275",
        "0,275",
        "0.27",
        "0,27",
        "27.5%"
      ],
      "explanation": "1. Механическая энергия на тепло: Q_мех = 0,5 · (m_п · 400² / 2) = 40 000 m_п.<br>2. Кристаллизация 20% жидкого свинца: Q₁ = 0,2 m_п · 25 000 = 5000 m_п.<br>3. Остывание свинца до 0 °C: Q₂ = m_п · 140 · 327 = 45 780 m_п.<br>4. Полное тепло: Q = (40 000 + 5000 + 45 780) m_п = 90 780 m_п.<br>5. Масса растаявшего льда: m_л = 90 780 m_п / 330 000 ≈ <strong>0,275 m_п</strong>."
    },
    {
      "id": "phys-8-heat-19",
      "num": 19,
      "title": "Нагрев стакана с водой и льдом",
      "type": "Тепло (Комбинированные)",
      "text": "<p class=\"task-text\">В стакан площадью <strong>0,04 м²</strong> налили <strong>200 г</strong> воды при <strong>0 °C</strong> и положили <strong>50 г</strong> льда при <strong>0 °C</strong>. Стакан стоит в комнате при <strong>25 °C</strong>. Коэффициент теплоотдачи от воздуха <strong>12 Вт/(м²·К)</strong>. Через сколько <strong>минут</strong> температура поднимется до <strong>10 °C</strong>?<br>(λ = 330 000, c = 4200 Дж/(кг·°C)). Округлите до целого числа.</p>",
      "answer": "41",
      "unit": "мин",
      "acceptedAnswers": [
        "41",
        "41 мин",
        "2469",
        "41 минута"
      ],
      "explanation": "1. Плавление 50 г льда при 0 °C: P₁ = 12 · 0,04 · 25 = 12 Вт. Q₁ = 0,05 · 330 000 = 16 500 Дж. t₁ = 16 500 / 12 = 1375 с.<br>2. Нагрев 250 г воды от 0 до 10 °C: средний напор ΔT = 25 − 5 = 20 К. P₂ = 12 · 0,04 · 20 = 9,6 Вт. Q₂ = 0,25 · 4200 · 10 = 10 500 Дж. t₂ = 10 500 / 9,6 = 1093,75 с.<br>3. Общее время: t = 1375 + 1093,75 = 2468,75 с ≈ <strong>41 минута</strong>."
    }
  ]
},
  {
  "id": "phys-8-humidity-all",
  "subject": "physics",
  "subjectLabel": "Физика",
  "title": "Задачи на влажность воздуха и насыщенный пар",
  "class": "8",
  "level": "medium",
  "description": "15 практических и качественных задач: абсолютная и относительная влажность, точка росы, психрометр, динамическое равновесие и свойства насыщенного пара.",
  "tasks": [
    {
      "id": "phys-8-hum-1",
      "num": 1,
      "title": "Изотермическое сжатие насыщенного пара",
      "type": "Насыщенный пар",
      "text": "<p class=\"task-text\">В плотно закрытом сосуде при постоянной температуре находятся вода и её насыщенный водяной пар. Как изменятся плотность и давление пара, если объём сосуда изотермически уменьшить в <strong>2 раза</strong>?</p>",
      "answer": "не изменятся",
      "unit": "",
      "acceptedAnswers": [
        "не изменятся",
        "не изменится",
        "останутся прежними",
        "не меняются",
        "останется прежней",
        "не изменится"
      ],
      "explanation": "Давление и плотность насыщенного пара зависят <strong>исключительно от температуры</strong>. При изотермическом уменьшении объёма избыток пара конденсируется в воду, а плотность и давление пара <strong>не изменятся</strong>."
    },
    {
      "id": "phys-8-hum-2",
      "num": 2,
      "title": "Относительная влажность в комнате",
      "type": "Относительная влажность",
      "text": "<p class=\"task-text\">В комнате объёмом <strong>50 м³</strong> при температуре <strong>20 °C</strong> содержится <strong>600 г</strong> водяного пара. Плотность насыщенного пара при этой температуре равна <strong>17,3 г/м³</strong>. Найдите относительную влажность воздуха в комнате в <strong>процентах</strong>. Округлите до целых.</p>",
      "answer": "69",
      "unit": "%",
      "acceptedAnswers": [
        "69",
        "69%",
        "69.4",
        "69,4"
      ],
      "explanation": "1. Абсолютная влажность (плотность пара): ρ = m / V = 600 г / 50 м³ = 12 г/м³.<br>2. Относительная влажность: φ = (ρ / ρ₀) · 100% = (12 / 17,3) · 100% ≈ <strong>69%</strong>."
    },
    {
      "id": "phys-8-hum-3",
      "num": 3,
      "title": "Равенство показаний термометров психрометра",
      "type": "Психрометр",
      "text": "<p class=\"task-text\">Сухой термометр психрометра показывает <strong>22 °C</strong>, а влажный — также <strong>22 °C</strong>. Чему равна относительная влажность воздуха в помещении в <strong>процентах</strong>?</p>",
      "answer": "100",
      "unit": "%",
      "acceptedAnswers": [
        "100",
        "100%"
      ],
      "explanation": "Разность показаний термометров Δt = 0 °C означает, что испарение с фитиля влажного термометра полностью прекратилось. Это происходит только тогда, когда водяной пар в воздухе максимально насыщен, т.е. относительная влажность равна <strong>100%</strong>."
    },
    {
      "id": "phys-8-hum-4",
      "num": 4,
      "title": "Влажность через парциальное давление",
      "type": "Относительная влажность",
      "text": "<p class=\"task-text\">Парциальное давление водяного пара в воздухе при температуре <strong>25 °C</strong> равно <strong>1,58 кПа</strong>, а давление насыщенного пара при той же температуре составляет <strong>3,16 кПа</strong>. Определите относительную влажность воздуха в <strong>процентах</strong>.</p>",
      "answer": "50",
      "unit": "%",
      "acceptedAnswers": [
        "50",
        "50%"
      ],
      "explanation": "Формула относительной влажности через парциальное давление: φ = (p / p₀) · 100% = (1,58 / 3,16) · 100% = 0,5 · 100% = <strong>50%</strong>."
    },
    {
      "id": "phys-8-hum-5",
      "num": 5,
      "title": "Нагревание ненасыщенного пара в сосуде",
      "type": "Изменение влажности",
      "text": "<p class=\"task-text\">Герметично закрытый стеклянный сосуд заполнен только ненасыщенным водяным паром (жидкости внутри нет). Как изменится <strong>абсолютная влажность</strong> воздуха в сосуде при его нагревании (увеличится, уменьшится или не изменится)?</p>",
      "answer": "не изменится",
      "unit": "",
      "acceptedAnswers": [
        "не изменится",
        "не меняется",
        "останется прежней",
        "не изменится"
      ],
      "explanation": "Абсолютная влажность — это плотность пара ρ = m / V. Так как сосуд запаян (m = const) и его объём постоянен (V = const), абсолютная влажность <strong>не изменится</strong> (при этом относительная влажность уменьшится, так как растёт ρ₀(T))."
    },
    {
      "id": "phys-8-hum-6",
      "num": 6,
      "title": "Выпадение росы при ночном охлаждении",
      "type": "Точка росы и конденсация",
      "text": "<p class=\"task-text\">Днём при температуре <strong>20 °C</strong> относительная влажность составляла <strong>60%</strong>. Выпадет ли роса ночью, если температура опустится до <strong>10 °C</strong>?<br>(Плотность насыщенного пара: при 20 °C — 17,3 г/м³, при 10 °C — 9,4 г/м³). Ответьте <strong>да</strong> или <strong>нет</strong>.</p>",
      "answer": "да",
      "unit": "",
      "acceptedAnswers": [
        "да",
        "выпадет",
        "роса выпадет"
      ],
      "explanation": "1. Фактическая плотность пара: ρ = 0,60 · 17,3 = 10,38 г/м³.<br>2. При 10 °C предельная плотность насыщения равна 9,4 г/м³.<br>3. Так как 10,38 г/м³ > 9,4 г/м³, воздух пересыщен влагой, и избыток пара сконденсируется в капли росы. Ответ: <strong>да</strong>."
    },
    {
      "id": "phys-8-hum-7",
      "num": 7,
      "title": "Сравнение влажности по показаниям психрометров",
      "type": "Психрометр",
      "text": "<p class=\"task-text\">В двух одинаковых комнатах температура <strong>20 °C</strong>. В первой комнате разность показаний сухого и влажного термометров равна <strong>4 °C</strong>, а во второй — <strong>7 °C</strong>. В какой из комнат относительная влажность воздуха выше: в первой или во второй?</p>",
      "answer": "в первой",
      "unit": "",
      "acceptedAnswers": [
        "в первой",
        "в 1",
        "первая",
        "1",
        "первой"
      ],
      "explanation": "Чем суше воздух, тем интенсивнее испаряется вода с фитиля и тем сильнее охлаждается влажный термометр (больше разность Δt). Меньшая разность (4 °C < 7 °C) указывает на более высокую влажность воздуха. Ответ: <strong>в первой</strong>."
    },
    {
      "id": "phys-8-hum-8",
      "num": 8,
      "title": "Дополнительное испарение воды в баллон",
      "type": "Изменение массы пара",
      "text": "<p class=\"task-text\">Относительная влажность воздуха в закрытом баллоне объёмом <strong>2 м³</strong> при температуре <strong>15 °C</strong> составляет <strong>40%</strong>. Какую массу воды в <strong>граммах</strong> необходимо дополнительно испарить в этот баллон при неизменной температуре, чтобы повысить влажность до <strong>90%</strong>?<br>(ρ₀(15 °C) = 12,8 г/м³).</p>",
      "answer": "12.8",
      "unit": "г",
      "acceptedAnswers": [
        "12.8",
        "12,8",
        "12.8 г"
      ],
      "explanation": "1. Начальная плотность: ρ₁ = 0,4 · 12,8 = 5,12 г/м³.<br>2. Конечная плотность: ρ₂ = 0,9 · 12,8 = 11,52 г/м³.<br>3. Изменение плотности: Δρ = 11,52 − 5,12 = 6,4 г/м³.<br>4. Масса воды: Δm = Δρ · V = 6,4 · 2 = <strong>12,8 г</strong>."
    },
    {
      "id": "phys-8-hum-9",
      "num": 9,
      "title": "Сущность состояния динамического равновесия",
      "type": "Качественные вопросы",
      "text": "<p class=\"task-text\">Что с точки зрения МКТ означает состояние динамического равновесия между жидкостью и её паром? Равенство каких двух скоростей/процессов устанавливается на границе раздела фаз?</p>",
      "answer": "испарения и конденсации",
      "unit": "",
      "acceptedAnswers": [
        "испарения и конденсации",
        "равенство скоростей испарения и конденсации",
        "скорости испарения и конденсации",
        "испарение и конденсация"
      ],
      "explanation": "Динамическое равновесие наступает, когда <strong>скорость испарения жидкости равна скорости конденсации пара</strong>: число молекул, вылетающих из жидкости в единицу времени, в точности равно числу молекул пара, возвращающихся в неё за то же время."
    },
    {
      "id": "phys-8-hum-10",
      "num": 10,
      "title": "Определение абсолютной влажности по точке росы",
      "type": "Точка росы",
      "text": "<p class=\"task-text\">При температуре воздуха <strong>18 °C</strong> точка росы оказалась равной <strong>10 °C</strong>. Чему равна абсолютная влажность воздуха в помещении в <strong>г/м³</strong>?<br>(Плотность насыщенного пара: при 18 °C — 15,4 г/м³, при 10 °C — 9,4 г/м³).</p>",
      "answer": "9.4",
      "unit": "г/м³",
      "acceptedAnswers": [
        "9.4",
        "9,4",
        "9.4 г/м³"
      ],
      "explanation": "Точка росы — это температура, при которой пар становится насыщенным при изобарическом охлаждении. Значит, фактическая плотность пара в комнате равна плотности насыщенного пара при температуре точки росы: ρ = ρ₀(10 °C) = <strong>9,4 г/м³</strong>."
    },
    {
      "id": "phys-8-hum-11",
      "num": 11,
      "title": "Плотность насыщенного пара при нагревании",
      "type": "Насыщенный пар",
      "text": "<p class=\"task-text\">В закрытом сосуде находятся вода и её насыщенный пар. Как меняется (<strong>увеличивается</strong> или <strong>уменьшается</strong>) плотность насыщенного водяного пара при повышении температуры сосуда, пока вся жидкость ещё не испарилась?</p>",
      "answer": "увеличивается",
      "unit": "",
      "acceptedAnswers": [
        "увеличивается",
        "растет",
        "возрастает",
        "увеличится"
      ],
      "explanation": "При нагревании увеличивается интенсивность испарения жидкости, масса пара в том же объёме растёт, поэтому плотность и концентрация насыщенного пара быстро <strong>увеличиваются</strong>."
    },
    {
      "id": "phys-8-hum-12",
      "num": 12,
      "title": "Изотермическое сжатие под поршнем",
      "type": "Изменение влажности",
      "text": "<p class=\"task-text\">В цилиндре под поршнем при постоянной температуре находится воздух с относительной влажностью <strong>60%</strong>. Какой станет относительная влажность воздуха в <strong>процентах</strong>, если объём под поршнем изотермически уменьшить в <strong>2 раза</strong>?</p>",
      "answer": "100",
      "unit": "%",
      "acceptedAnswers": [
        "100",
        "100%"
      ],
      "explanation": "При двукратном сжатии влажность стремится возрасти до 2 · 60% = 120%. Но в термодинамическом равновесии влажность не может превышать 100%. Как только влажность достигает 100%, пар становится насыщенным, и избыток пара конденсируется в воду при постоянной относительной влажности <strong>100%</strong>."
    },
    {
      "id": "phys-8-hum-13",
      "num": 13,
      "title": "Влияние высокой влажности на охлаждение тела",
      "type": "Прикладные вопросы",
      "text": "<p class=\"task-text\">Почему в жару (+32 °C) человек переносит влажный воздух (85%) значительно тяжелее, чем сухой (30%)? Испарению чего с поверхности кожи препятствует высокая влажность?</p>",
      "answer": "пота",
      "unit": "",
      "acceptedAnswers": [
        "пота",
        "испарению пота",
        "испарение пота",
        "пот"
      ],
      "explanation": "Естественное охлаждение организма происходит за счёт испарения пота с поверхности кожи (каждый грамм уносит около 2,4 кДж). Высокая относительная влажность резко снижает скорость испарения, пот стекает каплями, охлаждение нарушается и наступает перегрев."
    },
    {
      "id": "phys-8-hum-14",
      "num": 14,
      "title": "Смешение воздушных масс из двух сосудов",
      "type": "Смешение воздушных масс",
      "text": "<p class=\"task-text\">В первом закрытом сосуде объёмом <strong>1 м³</strong> находится воздух с относительной влажностью <strong>40%</strong>, а во втором сосуде объёмом <strong>3 м³</strong> при той же температуре — воздух с относительной влажностью <strong>80%</strong>. Сосуды соединили тонкой трубкой. Какая относительная влажность в <strong>процентах</strong> установится после перемешивания при неизменной температуре?</p>",
      "answer": "70",
      "unit": "%",
      "acceptedAnswers": [
        "70",
        "70%"
      ],
      "explanation": "1. Масса пара в 1-м сосуде: m₁ = 0,40 · ρ₀ · 1 = 0,40 ρ₀.<br>2. Во 2-м сосуде: m₂ = 0,80 · ρ₀ · 3 = 2,40 ρ₀.<br>3. Общая масса: m = 2,80 ρ₀. Общий объём: V = 1 + 3 = 4 м³.<br>4. Новая плотность: ρ = 2,80 ρ₀ / 4 = 0,70 ρ₀.<br>5. Итоговая относительная влажность: φ = (0,70 ρ₀ / ρ₀) · 100% = <strong>70%</strong>."
    },
    {
      "id": "phys-8-hum-15",
      "num": 15,
      "title": "Показания психрометра в тумане",
      "type": "Психрометр",
      "text": "<p class=\"task-text\">Осенью в сырую туманную погоду показания сухого и влажного термометров психрометра на улице практически совпали. Чему в <strong>процентах</strong> равна относительная влажность воздуха?</p>",
      "answer": "100",
      "unit": "%",
      "acceptedAnswers": [
        "100",
        "100%"
      ],
      "explanation": "Совпадение показаний означает, что испарение с влажного термометра прекратилось. Туман — это сконденсировавшийся насыщенный пар, относительная влажность воздуха равна <strong>100%</strong>."
    }
  ]
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
