package com.passwordtool.password_security_tool.model;

public class PasswordResponse {

    private int score;
    private String strength;
    private int entropy;
    private String crackTime;
    private boolean breached;
    private String report;

    public PasswordResponse(int score, String strength, int entropy,
                            String crackTime, boolean breached, String report) {
        this.score     = score;
        this.strength  = strength;
        this.entropy   = entropy;
        this.crackTime = crackTime;
        this.breached  = breached;
        this.report    = report;
    }

    // Getters
    public int getScore()          { return score; }
    public String getStrength()    { return strength; }
    public int getEntropy()        { return entropy; }
    public String getCrackTime()   { return crackTime; }
    public boolean isBreached()    { return breached; }
    public String getReport()      { return report; }
}