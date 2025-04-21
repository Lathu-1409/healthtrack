import java.util.Scanner;

public class Main {

    static class Result {
        int min, max;
        Result(int min, int max) { this.min = min; this.max = max; }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String expression = scanner.nextLine();
        Result result = calculateMinMax(expression);
        System.out.println(result.min + " " + result.max);
    }

    public static Result calculateMinMax(String expr) {
        if (expr.matches("\\d+")) return new Result(Integer.parseInt(expr), Integer.parseInt(expr));

        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;

        for (int i = 0; i < expr.length(); i++) {
            char op = expr.charAt(i);
            if (op == '+' || op == '*') {
                Result left = calculateMinMax(expr.substring(0, i));
                Result right = calculateMinMax(expr.substring(i + 1));

                int[] results = calculate(left, right, op);
                min = Math.min(min, Math.min(results[0], results[1]));
                max = Math.max(max, Math.max(results[0], results[1]));
            }
        }

        return new Result(min, max);
    }

    public static int[] calculate(Result left, Result right, char op) {
        if (op == '+') {
            return new int[]{left.min + right.min, left.max + right.max};
        } else {
            return new int[]{left.min * right.min, left.max * right.max};
        }
    }
}