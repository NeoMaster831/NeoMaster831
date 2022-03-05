/*
Q. 왜 석판을 자르는 건가요?
A. 몰라요 시발
*/
#include <cstdio>
#include <vector>
#include <algorithm>
#define RC 20

using namespace std;

int pan[20][20][2]; // [0] = 세로형, [1] = 가로형
int N;

int available(int min_x, int max_x, int min_y, int max_y) { // true = 가로, false = 세로
    int count[3] = { 0, }; // 간편하게 하기 위함
    for (int i = min_x; i <= max_x; i++) {
        for (int j = min_y; j <= max_y; j++) {
            count[pan[i][j][0]]++;
        }
    }

    if (count[2] == 0) return 0; // 보석 결정체가 하나도 없다면
    if (count[2] == 1) { // 아니면?
        if (count[1] == 0) { // 불순물이 하나도 없다면 잘 잘랐고 더이상 볼 필요 없음 ㅅㄱ
            return 1;
        }
        else return 0;
    }
    if (count[1] == 0) {
        return 0;
    }
    return 2; // 이도저도 아니고, 분할 한번 더 해야됨
}

int divide_n_conquer(int xy1[2], int xy2[2], bool type) { // true = 가로, false = 세로
    int return_type = available(xy1[0], xy2[0], xy1[1], xy2[1]);
    if (return_type == 0) return 0;
    if (return_type == 1) return 1;

    int gyungwoo = 0;
    for (int i = xy1[!type] + 1; i < xy2[!type]; i++) {
        bool can = false;
        for (int j = xy1[type]; j <= xy2[type]; j++) { // 길을 가로막고 있다면?
            if (pan[i][j][!type] == 2) {
                can = false;
                break;
            }
            else if (pan[i][j][!type] == 1) {
                can = true;
            }
        }

        if (can == false) continue;

        int left[2][2] = { {xy2[0], i - 1}, {i - 1, xy2[1]} }; // 왼쪽이 세로형, 오른쪽 가로형
        int right[2][2] = { {xy1[0], i + 1}, {i + 1, xy1[1]} };

        int left_gyungwoo = divide_n_conquer(xy1, left[type], !type);
        int right_gyungwoo = divide_n_conquer(right[type], xy2, !type);

        if (left_gyungwoo == 0 || right_gyungwoo == 0) continue;
        gyungwoo += left_gyungwoo * right_gyungwoo; // 동시에 일어날 수 있는 경우이니 곱하기. 더했다가 존나 해멤.
    }

    return gyungwoo;
}

int main() {

    scanf("%d", &N);

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            scanf("%d", &pan[i][j][0]);
            pan[j][i][1] = pan[i][j][0];
        }
    }

    int a[2] = { 0, 0 };
    int b[2] = { N - 1, N - 1 };
    int ans = divide_n_conquer(a, b, true) + divide_n_conquer(a, b, false);
    if (ans == 0) printf("-1\n");
    else printf("%d\n", ans); // 올해 구현실력 다썼다...어떻게 이렇게 간편하게 나타낼 수 있냐?진짜가슴이웅장해진다...이게 지혼자 Vector2 스트럭트 만들어서 지랄했던 박종휘가 맞나..진짜 ㄹㅈ[]다.

}
